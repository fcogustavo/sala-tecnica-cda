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
    console.log(user)
    if (arquive) {  
        (async () => {
            let users = await User.find().lean();
            users.forEach(u => {
                if (u.email == user.email) {
                    console.log(true)
                    u["select"] = "selected";
                } else {
                    u["select"] = "";
                };
            });
            let objDataPDF = await pdfDataExtract(arquive.path);
            arquive = arquive.path
            console.log(users)
            res.render('admin/register_gauges', {objDataPDF, users, arquive});
        })();
    } else {
        res.redirect('/admin/register_gauges');
    };
});

router.post('/export_gauges', eAdmin, upload.single('registerGauges'), (req, res) => {
    console.log(req.body.arquive)
    console.log(req.body.objDataPDF)
     
    (async () => {
        const objDataPDF = await pdfDataExtract(req.body.arquive)
        console.log(objDataPDF)

    })();
    res.redirect('/');
})

module.exports = router;