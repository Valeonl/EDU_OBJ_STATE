export default {
	async makeReport() {
		try {
			// Показываем модальное окно с прогрессом
			showModal(modal_download.name);
			progress_bar_excel.setProgress(0);
			download_status_text.setText("Начинаем формирование отчёта...");

			// Конфигурация отчетов
			const reportsData = [
				{
					query: edu_object_state_appendix_1,
					sheetName: "Приложение 1",
					sheetIndex: 1,
					startRow: 16,
					startColumn: 'C'
				},
				{
					query: edu_object_state_appendix_2,
					sheetName: "Приложение 2",
					sheetIndex: 2,
					startRow: 16,
					startColumn: 'B'
				},
				{
					query: edu_object_state_appendix_3,
					sheetName: "Приложение 3",
					sheetIndex: 3,
					startRow: 13,
					startColumn: 'B'
				},
				{
					query: edu_object_state_appendix_4,
					sheetName: "Приложение 4",
					sheetIndex: 4,
					startRow: 19,
					startColumn: 'C'
				},
				{
					query: edu_object_state_appendix_5,
					sheetName: "Приложение 5",
					sheetIndex: 5,
					startRow: 10,
					startColumn: 'B'
				},
				{
					query: edu_object_state_appendix_6,
					sheetName: "Приложение 6",
					sheetIndex: 6,
					startRow: 10,
					startColumn: 'C'
				}
			];

			// Загружаем данные с индикацией прогресса
			download_status_text.setText("Загружаем данные по приложениям...");
			progress_bar_excel.setProgress(10);

			const allData = {};
			const totalReports = reportsData.length;
			let currentReport = 0;

			for (const report of reportsData) {
				try {
					currentReport++;
					const progress = 10 + Math.floor((currentReport / totalReports) * 20);
					progress_bar_excel.setProgress(progress);
					download_status_text.setText(`Загружаем данные по <br>${report.sheetName}... (${currentReport}/${totalReports})`);

					const queryResult = await report.query.run();
					allData[report.sheetIndex] = {
						data: queryResult,
						config: report
					};
				} catch (error) {
					console.error(`Ошибка загрузки данных для листа ${report.sheetIndex}:`, error);
					throw new Error(`Ошибка загрузки данных для листа ${report.sheetIndex}`);
				}
			}

			// Загружаем шаблон Excel
			download_status_text.setText("Загружаем шаблон Excel...");
			progress_bar_excel.setProgress(30);

			const base64Data = excel_template_data.template_excel_data.split(',')[1] || excel_template_data.template_excel_data;
			const binaryString = atob(base64Data);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}

			// Создаем книгу Excel
			const workbook = new ExcelJS.Workbook();
			await workbook.xlsx.load(bytes.buffer);

			// Функция для получения буквы колонки
			const getColumnLetter = (startCol, index) => {
				const startColIndex = startCol.charCodeAt(0) - 65;
				const targetIndex = startColIndex + index;
				let letter = '';
				let remaining = targetIndex;
				while (remaining >= 0) {
					letter = String.fromCharCode(65 + (remaining % 26)) + letter;
					remaining = Math.floor(remaining / 26) - 1;
				}
				return letter;
			};

			// Обрабатываем каждый лист
			let currentSheet = 0;
			for (const report of reportsData) {
				currentSheet++;
				const sheetData = allData[report.sheetIndex];
				if (!sheetData || !sheetData.data) {
					console.error(`Нет данных для листа ${report.sheetIndex}`);
					continue;
				}

				// Обновляем прогресс
				const progress = 30 + Math.floor((currentSheet / totalReports) * 50);
				progress_bar_excel.setProgress(progress);
				download_status_text.setText(`Формируем ${report.sheetName}... (${currentSheet}/${totalReports})`);

				// Получаем лист
				let worksheet = workbook.getWorksheet(report.sheetName) || workbook.getWorksheet(report.sheetIndex);
				if (!worksheet) {
					console.error(`Лист не найден: ${report.sheetName}`);
					continue;
				}

				// Заполняем данные
				const totalRows = sheetData.data.length;
				sheetData.data.forEach((row, rowIndex) => {
					const rowProgress = progress + Math.floor((rowIndex / totalRows) * (50 / totalReports));
					progress_bar_excel.setProgress(rowProgress);
					download_status_text.setText(`Обрабатываем строки в ${report.sheetName}... (${rowIndex + 1}/${totalRows})`);

					// Создаем новую строку
					const newRow = worksheet.insertRow(report.startRow + rowIndex, [], 'o+');

					// Заполняем ячейки
					Object.values(row).forEach((value, colIndex) => {
						const colLetter = getColumnLetter(report.startColumn, colIndex);
						newRow.getCell(colLetter).value = value === null ? ' ' : value; // Replace null with empty string
					});

					// Копируем стили
					const templateRow = worksheet.getRow(report.startRow - 1);
					const numColumns = Object.keys(row).length;

					for (let i = 0; i < numColumns; i++) {
						const colLetter = getColumnLetter(report.startColumn, i);
						newRow.getCell(colLetter).style = JSON.parse(JSON.stringify(templateRow.getCell(colLetter).style));
					}

					newRow.height = templateRow.height;
				});
			}

			// Генерируем и скачиваем файл
			download_status_text.setText("Подготовка файла к загрузке...");
			progress_bar_excel.setProgress(90);

			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			});
			const url = URL.createObjectURL(blob);

			try {
				const currentDate = new Date().toISOString().split('T')[0];
				download_status_text.setText("Загрузка файла...");
				progress_bar_excel.setProgress(95);

				await download(url,
											 `Отчет_Надлежащее_состояние_объектов_${(appsmith.store.superuser.ou_full_name)}_${currentDate}.xlsx`,
											 "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

				download_status_text.setText("Готово!");
				progress_bar_excel.setProgress(100);
				showAlert('Отчет успешно создан и скачан!');
			} catch (error) {
				showAlert('Ошибка при скачивании отчета: ' + error.message);
			} finally {
				URL.revokeObjectURL(url);
				closeModal(modal_download.name);
			}

		} catch (error) {
			showAlert('Ошибка при формировании отчета: ' + error.message);
			console.error('Ошибка:', error);
			closeModal(modal_download.name);
		}
	},

	return: {
		makeReport: this.makeReport
	}
}
