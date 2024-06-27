const fs = require('fs');
const PDFDataExtract = require('pdfdataextract');
const xl = require('excel4node');

const wb = new xl.Workbook();

var ws = wb.addWorksheet('Database');

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
		console.log(lines);
		let i = 0;
		let os = {};
		let listOS = [];
		lines.forEach(item => {
			let l_item = item.split(' ');
			if(Number(l_item[0])) {
				if (i == 0) {
					os["os"] = l_item[0];
					i++;
				} else {
					os["trechos"] = l_item.join(', ');
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
					l_temp.splice(0, 2, String(n3), String(n2), String(n1));
				} else {
					n2 = Number(t2.slice(t + 1, t2.length));
					n3 = Number(t2.slice(0, t + 1));			
					l_temp.splice(0, 2, String(n3), String(n2), String(n1));
				}
				l_temp.pop();
				l_temp.unshift(l_item[0], l_item[1], l_item[2]);
				for (let c = 4; c < l_item.length; c++) {
					l_temp.push(l_item[c]);
				};
				os["localizador"] = l_temp[0];
				os["bitola"] = l_temp[1];
				os["formato"] = l_temp[2];
				os["dobras"] = l_temp[3];
				/*
				os["comprimentoReal"] = l_temp[4];
				os["comprimentoNominal"] = l_temp[5];
				os["peso"] = l_temp[6];
				os["quantidade"] = l_temp[7];
				*/
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
	const listOS = await pdfDataExtract('arquives_test/Teste corte médio.pdf');

	let headingColumnNames = Object.keys(listOS[0]);
	console.log(headingColumnNames)
	
	let headingColumnIndex = 1;
	
	headingColumnNames.forEach(heading => {
		ws.cell(1, headingColumnIndex++).string(heading);
	});
	let rawIndex = 2;
	listOS.forEach(os => {
		let columnIndex = 1;
		headingColumnNames.forEach(columnName => {
			ws.cell(rawIndex, columnIndex++).string(os[columnName]);
		});
		rawIndex++
	});
	wb.write('planilhaTest4.xlsx');
})();

module.exports = pdfDataExtract;