const express = require('express');
const router = express.Router();
const {eAdmin} = require('../helpers/eAdmin');
const User = require('../models/User');
const pdfDataExtract = require('../pdfdataextract');
const exportDataSheets = require('../exportdatasheets');
const multer = require('multer');
const upload = multer({dest: './public/data/uploads'});

router.get('/', eAdmin, (req, res) => {
    res.render('admin/index');
});

router.get('/register_gauges', eAdmin, (req, res) => {
    res.render('admin/register_gauges');
});

router.post('/get_gauges', eAdmin, upload.single('registerGauges'), (req, res) => {
    let arquive = req.file;
    let user = req.user;
    if (arquive) {  
        (async () => {
            let objDataPDF = await pdfDataExtract(arquive.path);
            console.log(objDataPDF)
            if (typeof objDataPDF == "string") {
                req.flash('error_msg', objDataPDF);
                res.redirect('/admin/register_gauges');
            } else {
                let users = await User.find().lean();
                users.forEach(u => {
                    if (u.email == user.email) {
                        u["select"] = "selected";
                    } else {
                        u["select"] = "";
                    };
                });
                arquive = arquive.path
                res.render('admin/register_gauges', {objDataPDF, users, arquive});
            };  
        })();
    } else {
        res.redirect('/admin/register_gauges');
    };
});

router.post('/export_gauges', eAdmin, upload.single('registerGauges'), (req, res) => {
    (async () => {
        const objDataPDF = await pdfDataExtract(req.body.arquive)
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
        exportDataSheets(objDataPDF);
        console.log(objDataPDF);
        req.flash('success_msg', "Dados enviados com sucesso!");
        res.redirect('/');
    })();
})

module.exports = router;