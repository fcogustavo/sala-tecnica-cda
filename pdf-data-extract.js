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

		// Formata a partir do data.
		let data_text = ''
		data_1.text.forEach(txt => {
			txt += '\n';
			data_text += txt;
		});
		let lines = data_text.split('\n');
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
					os.trechos = l_item;
				};
			} else if (l_item[0].includes('.')) {
				let l_temp = l_item[3].split(',')
				let t1 = l_temp[1].replaceAll('.','')
				let t2 = l_temp[0].replaceAll('.','')
				let len = String(Number(t1)).length
				let t = t2.length - len;
				let n1 = Number(t1);
				let n2 = Number(t2.slice(t, t2.length));
				let n3 = Number(t2.slice(0, t));
				if (n2 <= n1) {
					l_temp.splice(0, 2, n3, n2, n1);
				} else {
					n2 = Number(t2.slice(t + 1, t2.length));
					n3 = Number(t2.slice(0, t + 1));			
					l_temp.splice(0, 2, n3, n2, n1);
				}
				l_temp.pop();
				let l_temp2 = l_item.slice(0,3).concat(l_temp, l_item.slice(4, l_item.length));
				os.localizador = l_temp2[0];
				os.bitola = l_temp2[1];
				os.formato = l_temp2[2];
				os["nº de dobras"] = l_temp2[3];
				os["comprimento real"] = l_temp2[4];
				os["comprimento nominal"] = l_temp2[5];
				os.peso = l_temp2[6];
				os.quantidade = Number(l_temp2[7]);
				listOS.push(os);
				os = {};
				i = 0;
			}
		});

		return listOS;
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