const fs = require('fs');
const PDFDataExtract = require('pdfdataextract');

const pdfDataExtract = async (file) => {

	const file_data = fs.readFileSync(file);

	// Busca o data aguardando.
	try {
		const data_1 = await PDFDataExtract.PdfData.extract(file_data, {
			pages: 100,
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
		let data_text = ''
		data_1.text.forEach(txt => {
			txt += '\n';
			data_text += txt;
		});
		let lines = data_text.split('\n');
		console.log(lines);
		let i = 0;
		let os = {};
		let listOS = [];
		lines.forEach(item => {
			let l_item = item.split(' ');
			if(Number(l_item[0])) {
				if (i == 0) {
					os.os = Number(l_item[0]);
					i++;
				} else {
					os.param_2 = item;
				};
			} else if (l_item[0].includes('.')) {
				os.param_3 = item;
				listOS.push(os);
				os = {};
				i = 0;
			}
		});
		console.log(listOS);

		return data_text//{gauges, summary, totalWeight};
	} catch (err) {
		console.log(`Ocorreu um erro durante o processo: ${err.message}`);
		return "Ocorreu um erro. Verifique o formato do arquivo.";
	};
};

(async () => {
	const test = await pdfDataExtract('arquives_test/Teste corte médio.pdf')
	console.log(test)
})()

module.exports = pdfDataExtract;