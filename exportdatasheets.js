const {GoogleSpreadsheet} = require('google-spreadsheet');
const credentials = require('./config/credentials.json')

const idSheetCDA = '11Kk2nFmJSqrfKD_uB5aiGbZ9hCA0K6Ss_sKRP_zDlVk'
const idSheetTest = '1hWAX934Wk2sE1xeja_Di4L5f2nsc5I-e7XfXTnnloyc'

const exportData = async (obj=undefined) => {
    try {
        const doc = new GoogleSpreadsheet(idSheetTest);
    
        await doc.useServiceAccountAuth({
            client_email: credentials.client_email,
            private_key: credentials.private_key
        });

        await doc.loadInfo();

        console.log(doc.title);

        const sheet = doc.sheetsByIndex[0];
        
        //await sheet.loadHeaderRow();

        //let listHeader = sheet.headerValues

        if (obj && typeof obj == 'object' && !Array.isArray(obj)) {
            for (let line of obj.gauges) {
                let t = new Date(Date.now());
                await sheet.addRow({
                    "Carimbo de data/hora": t.toLocaleString(),
                    "Identifique-se:": line.planilhador,
                    "Lançar o romaneio:": line.romaneio,
                    "Informe a bitola:": line.bitola + "mm",
                    "Peso total deste romaneio:": line.peso,
                    "Informe neste campo alguma observação:": line.observacao
                });
            };  
        };
        
        return doc;
    } catch (err) {
        console.log(`Ocorreu um erro durante o processo: ${err.message}`);
        return {};
    };
};
/*
(async () => { 
    const test = await exportData();
    console.log(test.title)
})()
*/
module.exports = exportData;