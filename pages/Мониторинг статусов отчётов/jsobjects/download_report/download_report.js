export default {
	async makeReport() {
		try {
			// Конфигурация отчетов остается той же
			const reportsData = [
				{
					query: edu_object_state_appendix_1,
					sheetName: "Приложение 1", // Добавим имена листов для надежности
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

			// Загружаем данные (эта часть остается без изменений)
			const allData = {};
			for (const report of reportsData) {
				try {
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

			// Декодирование шаблона (остается без изменений)
			const base64Data = excel_template_data.template_excel_data.split(',')[1] || 
						excel_template_data.template_excel_data;
			const binaryString = atob(base64Data);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}

			// Создаем книгу Excel
			const workbook = new ExcelJS.Workbook();
			await workbook.xlsx.load(bytes.buffer);

			// Функция для получения буквы колонки (остается без изменений)
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

			// Проверяем и выводим информацию о листах в книге
			console.log('Доступные листы в книге:', workbook.worksheets.map(ws => ({
				name: ws.name,
				id: ws.id,
				index: workbook.worksheets.indexOf(ws) + 1
			})));

			// Обрабатываем каждый лист по порядку из конфигурации
			for (const report of reportsData) {
				const sheetData = allData[report.sheetIndex];
				if (!sheetData || !sheetData.data) {
					console.error(`Нет данных для листа ${report.sheetIndex}`);
					continue;
				}

				// Получаем лист по имени или индексу
				let worksheet = workbook.getWorksheet(report.sheetName) || 
						workbook.getWorksheet(report.sheetIndex);

				if (!worksheet) {
					console.error(`Лист не найден: ${report.sheetName} (индекс: ${report.sheetIndex})`);
					continue;
				}

				console.log(`Обработка листа "${report.sheetName}" (индекс: ${report.sheetIndex}):`, {
					startRow: report.startRow,
					startColumn: report.startColumn,
					dataLength: sheetData.data.length
				});

				// Заполняем данные
				sheetData.data.forEach((row, rowIndex) => {
					// Проверяем существующую строку
					let existingRow = worksheet.getRow(report.startRow + rowIndex);
					if (existingRow) {
						worksheet.spliceRows(report.startRow + rowIndex, 1); // Удаляем существующую строку
					}

					const newRow = worksheet.insertRow(report.startRow + rowIndex, [], 'o+');

					// Заполняем ячейки
					Object.values(row).forEach((value, colIndex) => {
						const colLetter = getColumnLetter(report.startColumn, colIndex);
						newRow.getCell(colLetter).value = value;
						console.log(`Записываем значение в ячейку ${colLetter}${report.startRow + rowIndex}: ${value}`);
					});

					// Копируем стили
					const templateRow = worksheet.getRow(report.startRow - 1);
					const numColumns = Object.keys(row).length;

					for (let i = 0; i < numColumns; i++) {
						const colLetter = getColumnLetter(report.startColumn, i);
						const templateCell = templateRow.getCell(colLetter);
						const newCell = newRow.getCell(colLetter);

						if (templateCell.style) {
							newCell.style = JSON.parse(JSON.stringify(templateCell.style));
						}
					}

					if (templateRow.height) {
						newRow.height = templateRow.height;
					}
				});
			}

			// Генерация и скачивание файла (остается без изменений)
			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			});
			const url = URL.createObjectURL(blob);

			try {
				const currentDate = new Date().toISOString().split('T')[0];
				await download(
					url, 
					`Отчет_Надлежащее_состояние_объектов_${(appsmith.store.superuser.ou_full_name)}_${currentDate}.xlsx`, 
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				);
				showAlert('Отчет успешно создан и скачан!', 'success');
			} catch (error) {
				showAlert('Ошибка при скачивании отчета: ' + error.message, 'error');
			} finally {
				URL.revokeObjectURL(url);
			}

		} catch (error) {
			showAlert('Ошибка при формировании отчета: ' + error.message, 'error');
			console.error('Ошибка:', error);
		}
	}
}