const express = require('express');
const router = express.Router();
const {eAdmin} = require('../helpers/eAdmin');
const User = require('../models/User');
const pdfDataExtract = require('../pdf-data-extract');
const exportDataSheets = require('../export-data-sheets');
const {sheetsGauges} = require('../config/datavar.json');
const multer = require('multer');
const upload = multer({dest: './public/data/uploads'});

router.get('/', eAdmin, (req, res) => {
    res.render('admin/index');
});

router.get('/register-gauges', eAdmin, (req, res) => {
    res.render('admin/register-gauges');
});

router.post('/get-gauges', eAdmin, upload.single('registerGauges'), (req, res) => {
    try {
        let arquive = req.file;
        if (arquive) {  
            (async () => {
                let objDataPDF = await pdfDataExtract(arquive.path);
                if (typeof objDataPDF == "string") {
                    req.flash('error_msg', objDataPDF);
                    res.redirect('/admin/register-gauges');
                } else {
                    console.log(objDataPDF);
                    let user = req.user;
                    let sheets = [];
                    for (let nameSheet in sheetsGauges) {
                        sheets.push({
                            sheet: nameSheet,
                            select: sheetsGauges[nameSheet]["status"] == "default" ? "selected" : ""
                        });
                    };
                    let users = await User.find().lean();
                    users.forEach(u => {
                        if (u.email == user.email) {
                            u["select"] = "selected";
                        } else {
                            u["select"] = "";
                        };
                    });
                    arquive = arquive.path;
                    res.render('admin/register-gauges', {objDataPDF, users, sheets, arquive});
                };  
            })();
        } else {
            res.redirect('/admin/register-gauges');
        };
    } catch (err) {
        console.log(`Houve um erro durante o processo: ${err.message}`)
        req.flash('error_msg', 'Houve um erro durante o processo. Tente novamente.');
        res.redirect('/admin/register-gauges');
    };
});

router.post('/export-gauges', eAdmin, upload.single('registerGauges'), (req, res) => {
    try {
        (async () => {
            let objDataPDF = await pdfDataExtract(req.body.arquive);
            if (typeof objDataPDF == "string") {
                req.flash('error_msg', "Houve um erro durante o processo. Tente novamente.");
                res.redirect('/admin/register-gauges');
            } else {
                for (let c = 0; c < objDataPDF.gauges.length; c++) {
                    let obs = "obs-" + objDataPDF.gauges[c].id;
                    objDataPDF.gauges[c]["planilhador"] = req.body.name[c];
                    objDataPDF.gauges[c]["observacao"] = req.body[obs];
                };
                if (Array.isArray(req.body.exc)) {
                    let i = 1
                    for (let exc of req.body.exc) {
                        objDataPDF.gauges.splice(Number(exc) - i, 1);
                        i++;
                    };
                } else if (req.body.exc) {
                    objDataPDF.gauges.splice(Number(req.body.exc) - 1, 1);    
                };
                let idSheet =  sheetsGauges[req.body.sheet]["id"];
                let process = await exportDataSheets(objDataPDF, idSheet);
                if (process.statusProcess == "success") {
                    req.flash('success_msg', process.msg);
                    console.log(objDataPDF); 
                } else {
                    req.flash('error_msg', process.msg)
                };
                res.redirect('/');   
            };  
        })();
    } catch (err) {
        console.log(`Houve um erro durante o processo: ${err.message}`)
        req.flash('error_msg', 'Houve um erro durante o processo.');
        res.redirect('/');
    };
});

router.get('/helix-continues', eAdmin, (req, res) => {
    res.render('admin/helix-continues')
});

module.exports = router;