const express = require('express');
const router = express.Router();
const {eAdmin} = require('../helpers/eAdmin');
const pdfDataExtract = require('../pdfdataextract');
const exportData = require('../exportdatasheets')
const multer = require('multer');
const upload = multer({dest: './public/data/uploads'});

router.get('/', eAdmin, (req, res) => {
    res.render('admin/index');
});

router.get('/register_gauges', eAdmin, (req, res) => {
    res.render('admin/register_gauges');
});

router.post('/register_gauges', eAdmin, upload.single('registerGauges'), (req, res) => {
    let arquive = req.file
    if (arquive) {  
        (async () => {
            const objDataPDF = await pdfDataExtract(arquive.path)
            console.log(objDataPDF)
            const dataSheets = exportData(objDataPDF, '', 'Gustavo')
            console.log(dataSheets.title)
        })()
    }
    res.redirect('/')
})

module.exports = router;