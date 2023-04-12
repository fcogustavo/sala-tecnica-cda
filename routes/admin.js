const express = require('express');
const router = express.Router();
const {eAdmin} = require('../helpers/eAdmin');
const pdfDataExtract = require('../pdfdataextract');
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
            const test = await pdfDataExtract(arquive.path)
            console.log(test)
        })()
    }
    res.redirect('/')
})

module.exports = router;