const fs = require('fs');
const PDFDataExtract = require('pdfdataextract');
const { constrainedMemory } = require('process');

const pdfDataExtract = async (file) => {

	let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	const file_data = fs.readFileSync(file);

	// Busca o data aguardando.
	try {
		const data_1 = await PDFDataExtract.PdfData.extract(file_data, {
			pages: 10,
			sort: true,
			verbosity: PDFDataExtract.VerbosityLevel.ERRORS,
			get: {
				pages: true,
				text: true,
				fingerprint: true,
				outline: true,
				metadata: true,
				info: true,
				permissions: true, // get permissions
			}
		});
		// Formata o objeto gauges a partir do data.
		let gauges = {};
		let data_text = data_1.text; // an array of text pages
		let lines = data_text[0].split('\n');
		let i = 0;
		let c = 0;
		let esp = false;
		let requestCode = ""
		let codePackingList;
		for (let line of lines) {
			if (esp) {
				esp = false;
				let temp = line.split(' ');
				let temp_2 = temp[0].split('.');
				requestCode += temp_2[0] + temp_2[1];
			};
			if (line.includes('Localizador')) {
				esp = true; 
			};
			if (line.includes('Resumo Pedido')) {
				break;
			};
			if (line.includes('CA50') || line.includes('CA60')) {
				if (c == 0) {
					i++;
					codePackingList = requestCode + alphabet[i - 1]
					gauges[codePackingList] = [];
				};
				let temp = line.split(' ');
				gauges[codePackingList].push({
					"aco": temp[1],
					"bitola": temp[0],
					"peso": temp[2]
				});
				c++;
			} else {
				c = 0;
			};
		};

		return gauges;
	} catch (err) {
		console.log(`Ocorreu um erro durante o processo: ${err.message}`);
		return {};
	};
};
/*
(async () => {
	const test = await pdfDataExtract('arquives_test/PDFs/resumo_de_aco/CSC.005-A ao D.pdf')
	console.log(test)
})()
*/
module.exports = pdfDataExtract;