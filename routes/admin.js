const express = require('express');
const router = express.Router();
const {eAdmin} = require('../helpers/eAdmin');
const pdfDataExtract = require('../pdfdataextract');
const exportDataSheets = require('../exportdatasheets');
const functionsGauges = require('../functionsGauges');
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
    if (arquive) {  
        (async () => {
            let objDataPDF = await pdfDataExtract(arquive.path)
            let objDataPDFKeys = Object.keys(objDataPDF);
            let rowsDataPDF = await functionsGauges.rowsDataPDF(objDataPDF, objDataPDFKeys);
            res.render('admin/register_gauges', {rowsDataPDF});
        })();
    };
});

router.post('/export_gauges', eAdmin, upload.single('registerGauges'), (req, res) => {
    let arquive = req.file;
    if (arquive) {  
        (async () => {
            const objDataPDF = await pdfDataExtract(arquive.path)
            console.log(objDataPDF)
            const dataSheets = exportDataSheets(objDataPDF, '', 'Gustavo')

        })();
    };
    res.redirect('/');
})

module.exports = router;