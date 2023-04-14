const {GoogleSpreadsheet} = require('google-spreadsheet');
const credentials = require('./config/credentials.json')

const idSheetCDA = '11Kk2nFmJSqrfKD_uB5aiGbZ9hCA0K6Ss_sKRP_zDlVk'
const idSheetTest = '1hWAX934Wk2sE1xeja_Di4L5f2nsc5I-e7XfXTnnloyc'

const exportData = async () => {
    try {
        const doc = new GoogleSpreadsheet(idSheetTest);
    
        await doc.useServiceAccountAuth({
            client_email: credentials.client_email,
            private_key: credentials.private_key
        });

        await doc.loadInfo();

        console.log(doc.title);

        const sheet = doc.sheetsByIndex[0];
        
        await sheet.loadHeaderRow()

        let listHeader = sheet.headerValues;
        
        console.log(listHeader)

        return doc
    } catch (err) {
        console.log(`Ocorreu um erro durante o processo: ${err.message}`)
        return {}
    }   
}

(async () => { 
    const test = await exportData();
    console.log(test.title)
})()

/*
getDoc().then(doc => {
    console.log(doc.title);
    const sheet = doc.sheetsByIndex[0];
    let t
    sheet.loadHeaderRow().then(t => {
        
        t = sheet.headerValues
        console.log(t)
    })
    
    sheet.addRows([
        {PLANILHADOR: 'Gustavo', 'BITOLA': '5mm'},
        {'PLANILHADOR': 'Gustavo', 'BITOLA': '8mm'}
    ]);
});*/