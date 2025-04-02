export default {
	async export_excel() {
		try {
			showModal(modal_download.name);
			progress_bar_excel.setProgress(0);
			download_status_text.setText("Начинаем формирование отчёта...");

			// Выполнение всех SQL-запросов для получения отчётов
			download_status_text.setText("Получаем данные по отчётам...");
			progress_bar_excel.setProgress(10);

			if (download_cancel.isDisabled) return;

			try {
				const queries = [
					{ query: form_1_sql_group_data, name: "форме 1" },
					{ query: form_2_1_sql_group_data, name: "форме 2.1" },
					{ query: form_2_2_sql_group_data, name: "форме 2.2" },
					{ query: form_3_sql_group_data, name: "форме 3" },
					{ query: form_4_sql_group_data, name: "форме 4" },
					{ query: form_5_1_sql_group_data, name: "форме 5.1" },
					{ query: form_5_2_sql_group_data, name: "форме 5.2" }
				];

				const totalProgress = 75;
				const progressStep = totalProgress / queries.length;
				let currentProgress = 0;

				for (const queryData of queries) {
					if (download_cancel.isDisabled) return;

					await queryData.query.run();

					currentProgress += progressStep;
					const roundedProgress = Math.round(currentProgress);

					progress_bar_excel.setProgress(roundedProgress);
					download_status_text.setText(`Получены данные по ${queryData.name} (${roundedProgress}%)`);
				}
			} catch (error) {
				showAlert('Ошибка при получении данных: ' + error.message);
				return;
			}
			const tableConfigs = [
				{ 
					table: form_1_sql_group_data.data,
					headers: [
						{
							"id": "iogv_short_name",
							"label": "iogv_short_name",
							"isVisible": false
						},
						{
							"id": "iogv",
							"label": "iogv",
							"isVisible": false
						},
						{
							"id": "iogv_name",
							"label": "ИОГВ",
							"isVisible": false
						},
						{
							"id": "login",
							"label": "ИНН",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
										 }							
						},
						{
							"id": "agencyname",
							"label": "Наименование ОУ",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }			
						},
						{
							"id": "number",
							"label": "number",
							"isVisible": false
						},
						{
							"id": "course_subject",
							"label": "Предмет",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "class",
							"label": "Класс",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
										 }
						},
						{
							"id": "projected_student_count",
							"label": "Контингент 2025/26 (Прогнозное количество обучающихся  в 2025/26 учебном году, чел.)",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "textbooks_in_stock",
							"label": "Обеспеченность (Учебники  в наличии, шт. (1 комплект = 1 шт.))",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "additional_textbook_demand",
							"label": "Потребность (Дополнительная потребность  в учебниках, шт. (1 комплект = 1 шт.))",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						}
					],
					label: 'Форма 1',
					title: 'Форма 1',
					description: '1. Учебники, приобретение которых требуется в связи с истечением предельного срока использования в 2025 году, установленного приказом Минпросвещения России от 5 ноября 2024 г. № 769  (1 комплект = 1 шт.)',
					totals: {
  enabled: true,
  sumColumns: ['projected_student_count', 'textbooks_in_stock', 'additional_textbook_demand'],
  totalRowStyle: {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } },
    font: { bold: true }
  }
				}
				},
				{ 
					table: form_2_1_sql_group_data.data,
					headers: [
						{
							"id": "iogv_short_name",
							"label": "iogv_short_name",
							"isVisible": false
						},
						{
							"id": "iogv",
							"label": "iogv",
							"isVisible": false
						},
						{
							"id": "iogv_name",
							"label": "ИОГВ",
							"isVisible": false
						},
						{
							"id": "login",
							"label": "ИНН",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
										 }							
						},
						{
							"id": "agencyname",
							"label": "Наименование ОУ",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }			
						},
						{
							"id": "course_subject",
							"label": "Предмет",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "class_spo",
							"label": "Класс",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
										 }
						},
						{
							"id": "student_count_2024_2025",
							"label": "Контингент в 2024/25 ",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "projected_student_count",
							"label": "Контингент  прогноз 2025/26 ",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "unified_state_count",
							"label": "Количество единых государственных учебников, закупленных до 2025 года, шт.",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "additional_demand",
							"label": "Дополнительная потребность  в учебниках  в 2025/26 учебном году, шт.",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						}
					],
					label: 'Форма 2.1',
					title: 'Форма 2.1',
					description: '2.1. Единые государственные учебники, включенные в федеральный перечень учебников, приказ Минпросвещения России от 5.11.24 г. № 769',
					totals: {
  enabled: true,
  sumColumns: ['student_count_2024_2025', 'projected_student_count', 'unified_state_count', 'additional_demand'],
  totalRowStyle: {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } },
    font: { bold: true }
  }
				}
				},
				{ 
					table: form_2_2_sql_group_data.data,
					headers: [
						{
							"id": "iogv_short_name",
							"label": "iogv_short_name",
							"isVisible": false
						},
						{
							"id": "iogv",
							"label": "iogv",
							"isVisible": false
						},
						{
							"id": "iogv_name",
							"label": "ИОГВ",
							"isVisible": false
						},
						{
							"id": "login",
							"label": "ИНН",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
										 }							
						},
						{
							"id": "agencyname",
							"label": "Наименование ОУ",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }			
						},
						{
							"id": "course_subject",
							"label": "Предмет",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "class",
							"label": "Класс",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
										 }
						},
						{
							"id": "projected_student_count",
							"label": "Прогнозное количество обучающихся  в 2025/26 учебном году, чел.",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "textbook_demand_2025_2026",
							"label": "Потребность  в учебниках  в 2025/2026  учебном году, шт.",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
					],
					label: 'Форма 2.2',
					title: 'Форма 2.2',
					description: '2.2. Единые государственные учебники, включение в федеральный перечень учебников которых планируется в 2025 году',
					totals: {
  enabled: true,
  sumColumns: ['projected_student_count', 'textbook_demand_2025_2026'],
  totalRowStyle: {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } },
    font: { bold: true }
  }
				}
					
				},
				{ 
					table: form_3_sql_group_data.data,
					headers: [
						{
							"id": "iogv_short_name",
							"label": "iogv_short_name",
							"isVisible": false
						},
						{
							"id": "iogv",
							"label": "iogv",
							"isVisible": false
						},
						{
							"id": "iogv_name",
							"label": "ИОГВ",
							"isVisible": false
						},
						{
							"id": "login",
							"label": "ИНН",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
										 }							
						},
						{
							"id": "agencyname",
							"label": "Наименование ОУ",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }			
						},
						{
							"id": "course_subject",
							"label": "Учебный предмет (курс)",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "class_spo",
							"label": "Класс",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
										 }
						},
						{
							"id": "student_count_2024_2025",
							"label": "Количество обучающихся  в 2024/25 учебном году, чел.",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "projected_student_count",
							"label": "Прогнозное количество обучающихся  в 2025/26 учебном году, чел.",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "textbooks_in_stock",
							"label": "Учебники в наличии, шт. (1 комплект = 1 шт.)",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "additional_demand",
							"label": "Дополнительная потребность  в учебниках  в 2025/2026 учебном году, шт. (1 комплект = 1 шт.)",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "demand_reason",
							"label": "Причина,  по которой  требуется приобретение учебников: увеличение контингента /  утрата /  дефектность /  иное (указать)",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }
						},
					],
					label: 'Форма 3',
					title: 'Форма 3',
					description: '3. Наличие учебников и дополнительная потребность в них к 1 сентября 2025 г. (1 комплект = 1 шт.)',
					totals: {
  enabled: true,
  sumColumns: ['student_count_2024_2025', 'projected_student_count', 'textbooks_in_stock', 'additional_demand'],
  totalRowStyle: {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } },
    font: { bold: true }
  }
				}
				},
				{ 
					table: form_4_sql_group_data.data,
					headers: [
						{
							"id": "iogv_short_name",
							"label": "iogv_short_name",
							"isVisible": false
						},
						{
							"id": "iogv",
							"label": "iogv",
							"isVisible": false
						},
						{
							"id": "iogv_name",
							"label": "ИОГВ",
							"isVisible": false
						},
						{
							"id": "login",
							"label": "ИНН",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
										 }							
						},
						{
							"id": "agencyname",
							"label": "Наименование ОУ",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }			
						},
						{
							"id": "years_of_use",
							"label": "Лет использования",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "textbooks_written_off_2024",
							"label": "Списанных комплектов в 2024 (Количество учебников, списанных  в 2024 году, шт.)",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "writeoff_reason",
							"label": "Причина списания (Причина списания: утрата /  дефектность / истечение предельного срока использования /  иное (указать))",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "total_writeoff_cost_thousands_rub",
							"label": "Сумма списанных учебников,  тыс. руб.(Совокупная стоимость списанных учебников,  тыс. руб.)",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						}
					],
					label: 'Форма 4',
					title: 'Форма 4',
					description: '4. Учебники, списанные в 2024 году',
					totals: {
  enabled: true,
  sumColumns: ['textbooks_written_off_2024', 'total_writeoff_cost_thousands_rub'],
  totalRowStyle: {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } },
    font: { bold: true }
  }
				}
				},
				{ 
					table: form_5_1_sql_group_data.data,
					headers: [
						{
							"id": "iogv_short_name",
							"label": "iogv_short_name",
							"isVisible": false
						},
						{
							"id": "iogv",
							"label": "iogv",
							"isVisible": false
						},
						{
							"id": "iogv_name",
							"label": "ИОГВ",
							"isVisible": false
						},
						{
							"id": "login",
							"label": "ИНН",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
										 }							
						},
						{
							"id": "agencyname",
							"label": "Наименование ОУ",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }			
						},
						{
							"id": "court_name",
							"label": "Наименование суда",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "case_count",
							"label": "Количество дел",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
					],
					label: 'Форма 5.1',
					title: 'Форма 5.1',
					description: '5.1 Судебные инстанции в субъекте РФ, в которых идет рассмотрение дел по вопросам необеспеченности обучающихся учебной литературой',
					totals: {
  enabled: true,
  sumColumns: ['case_count'],
  totalRowStyle: {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } },
    font: { bold: true }
  }
				}
				},
				{ 
					table: form_5_2_sql_group_data.data,
					headers: [
						{
							"id": "iogv_short_name",
							"label": "iogv_short_name",
							"isVisible": false
						},
						{
							"id": "iogv",
							"label": "iogv",
							"isVisible": false
						},
						{
							"id": "iogv_name",
							"label": "ИОГВ",
							"isVisible": false
						},
						{
							"id": "login",
							"label": "ИНН",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
										 }							
						},
						{
							"id": "agencyname",
							"label": "Наименование ОУ",
							"isVisible": false,
							style: { vertical: 'middle',
											horizontal: 'left',
											wrapText: true,
											width: 'autofit' 
										 }			
						},
						{
							"id": "court_name",
							"label": "Наименование суда",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: 'autofit' 
										 }
						},
						{
							"id": "court_decision_details",
							"label": "Реквизиты решения суда",
							"isVisible": true,
							style: { vertical: 'middle',
											horizontal: 'center',
											wrapText: true,
											width: '20' 
										 }
						},
					],
					label: 'Форма 5.2',
					title: 'Форма 5.2',
					description: '5.2 Судебные решения за последние 3 года по вопросам  необеспеченности обучающихся учебной литературой'					
				},
			];
			const inn = appsmith.store.superuser.login;
			const currentDate = new Date().toISOString().split('T')[0];
			const workbook = new ExcelJS.Workbook();

			const formatAgencyName = (name) => {
				return name.replace(/Администрация/g, '');
			};

			// Общий заголовок для всех форм
			const commonTitle = `Отчёт. Мониторинг по вопросу обеспеченности учебниками образовательных учреждений\n${formatAgencyName(appsmith.store.superuser.agencyname)}`;

			// Глобальные настройки границ
			const globalBorderSettings = {
				style: 'thin',
				color: '000000'
			};

			// Функция для добавления таблицы на лист
			const addTableToSheet = (worksheet, config, isFirstSheet) => {
				const visibleHeaders = config.headers.filter(h => h.isVisible);
				const columnCount = visibleHeaders.length;
				const lastColumn = String.fromCharCode(64 + columnCount);

				let currentRow = 1;

				if (isFirstSheet) {
					const titleRow = worksheet.addRow([commonTitle]);
					worksheet.mergeCells(`A1:${lastColumn}1`);
					const commonTitleCell = worksheet.getCell('A1');

					titleRow.height = 50;

					commonTitleCell.alignment = {
						horizontal: 'center',
						vertical: 'middle',
						wrapText: true
					};
					commonTitleCell.font = {
						bold: true,
						size: 16,
						name: 'Times New Roman'
					};

					const textLines = commonTitle.split('\n').length;
					const lineHeight = 20;
					titleRow.height = textLines * lineHeight;

					currentRow++;
				}

				// Добавляем описание
				worksheet.addRow([config.description]);
				worksheet.mergeCells(`A${currentRow}:${lastColumn}${currentRow}`);
				const descCell = worksheet.getCell(`A${currentRow}`);
				descCell.alignment = { horizontal: 'left', wrapText: true };
				descCell.font = {
					italic: true,
					name: 'Times New Roman'
				};
				currentRow++;

				// Создаем маппинг заголовков
				const headerMapping = visibleHeaders.reduce((acc, header) => {
					acc[header.id] = header;
					return acc;
				}, {});

				const visibleFields = Object.keys(headerMapping);
				const displayHeaders = visibleFields.map(id => headerMapping[id].label);

				// Добавляем заголовки таблицы
				const headerRow = worksheet.addRow(displayHeaders);
				headerRow.height = 50;

				// Применяем стили к заголовкам
				displayHeaders.forEach((header, index) => {
					const cell = headerRow.getCell(index + 1);
					cell.font = {
						bold: true,
						color: { argb: '000000' },
						name: 'Times New Roman'
					};
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'DDDDDD' }
					};
					cell.alignment = {
						vertical: 'middle',
						horizontal: 'center',
						wrapText: true
					};
				});

				// Фильтруем и добавляем данные
				config.table.forEach((rowData, rowIndex) => {
					const visibleData = visibleFields.map(field => rowData[field]);
					const excelRow = worksheet.addRow(visibleData);

					if (rowData.ishidenrow === true) {
						excelRow.hidden = true;
					}

					visibleFields.forEach((fieldId, colIndex) => {
						const cell = excelRow.getCell(colIndex + 1);
						const headerConfig = headerMapping[fieldId];

						if (headerConfig?.style) {
							cell.alignment = {
								vertical: headerConfig.style.vertical || 'middle',
								horizontal: headerConfig.style.horizontal || 'left',
								wrapText: headerConfig.style.wrapText || false
							};
						}

						cell.font = {
							color: { argb: '000000' },
							name: 'Times New Roman'
						};
					});
				});

        // Добавляем итоги если они включены
if (config.totals?.enabled) {
  const totalsRow = [];
  visibleFields.forEach((fieldId, index) => {
    if (index === 0) {
      totalsRow.push('ИТОГИ');
    } else if (config.totals.sumColumns.includes(fieldId)) {
      // Вычисляем сумму для указанного столбца
      const sum = config.table.reduce((acc, row) => {
        const value = Number(row[fieldId]) || 0;
        return acc + value;
      }, 0);
      totalsRow.push(sum);
    } else {
      totalsRow.push('-');
    }
  });

  const excelRow = worksheet.addRow(totalsRow);

  // Применяем стили к итоговой строке
  excelRow.eachCell((cell, colNumber) => {
    // Применяем базовые стили
    cell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };

    // Применяем стили из конфигурации
    if (config.totals.totalRowStyle) {
      if (config.totals.totalRowStyle.fill) {
        cell.fill = config.totals.totalRowStyle.fill;
      }
      if (config.totals.totalRowStyle.font) {
        cell.font = {
          ...cell.font,
          ...config.totals.totalRowStyle.font,
          name: 'Times New Roman'
        };
      }
    }

    // Выравнивание для разных типов ячеек в итоговой строке
    if (colNumber === 1) {
      // Для слова "ИТОГИ"
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left'
      };
    } else if (config.totals.sumColumns.includes(visibleFields[colNumber - 1])) {
      // Для числовых значений
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    } else {
      // Для прочерков
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    }
  });
}

				// Настройка ширины столбцов
				worksheet.columns.forEach((column, index) => {
					const headerConfig = visibleFields[index] ? headerMapping[visibleFields[index]] : null;

					if (headerConfig?.style?.width === 'autofit') {
						let maxLength = 0;
						column.eachCell({ includeEmpty: true }, cell => {
							if (cell.value) {
								const cellLength = cell.value.toString().length;
								maxLength = Math.max(maxLength, cellLength);
							}
						});
						column.width = Math.min(Math.max(maxLength + 2, 10), 50);
					} else if (headerConfig?.style?.width) {
						column.width = headerConfig.style.width;
					} else {
						column.width = 15;
					}
				});

				// Применяем границы ко всем ячейкам
				worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
					if (rowNumber <= currentRow) return;

					row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
						const headerConfig = visibleFields[colNumber - 1] ? headerMapping[visibleFields[colNumber - 1]] : null;
						const borderStyle = headerConfig?.style?.border?.style || globalBorderSettings.style;
						const borderColor = headerConfig?.style?.border?.color || globalBorderSettings.color;

						cell.border = {
							top: { style: borderStyle, color: { argb: borderColor } },
							left: { style: borderStyle, color: { argb: borderColor } },
							bottom: { style: borderStyle, color: { argb: borderColor } },
							right: { style: borderStyle, color: { argb: borderColor } }
						};
					});
				});

				// Добавляем более толстые границы для заголовков
				const headerRowCells = worksheet.getRow(currentRow);
				headerRowCells.eachCell({ includeEmpty: true }, cell => {
					cell.border = {
						top: { style: 'medium', color: { argb: globalBorderSettings.color } },
						left: { style: globalBorderSettings.style, color: { argb: globalBorderSettings.color } },
						bottom: { style: 'medium', color: { argb: globalBorderSettings.color } },
						right: { style: globalBorderSettings.style, color: { argb: globalBorderSettings.color } }
					};
				});	
			};

			// Добавляем листы для каждой формы
			if (download_cancel.isDisabled) return;
			download_status_text.setText("Формируем листы Excel... (85%)");
			progress_bar_excel.setProgress(85);

			tableConfigs.forEach((config, index) => {
				if (download_cancel.isDisabled) return;
				download_status_text.setText(`Формируем лист ${config.label}... (90%)`);
				const worksheet = workbook.addWorksheet(config.label);
				addTableToSheet(worksheet, config, index === 0);
			});

			if (download_cancel.isDisabled) return;
			download_status_text.setText("Подготовка файла к загрузке... (95%)");
			progress_bar_excel.setProgress(95);

			const fileName = `Отчёт. Мониторинг по вопросу обеспеченности учебниками образовательных учреждений ${formatAgencyName(appsmith.store.superuser.agencyname)}_${currentDate}.xlsx`;

			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			});
			const url = URL.createObjectURL(blob);

			try {
				if (download_cancel.isDisabled) {
					URL.revokeObjectURL(url);
					return;
				}
				download_status_text.setText("Загрузка файла... (100%)");
				progress_bar_excel.setProgress(100);

				await download(url, fileName, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
				closeModal(modal_download.name);
				showAlert('Файл успешно загружен!');
			} catch (error) {
				showAlert('Ошибка при загрузке файла: ' + error.message);
			} finally {
				URL.revokeObjectURL(url);
			}
		} catch (error) {
			showAlert('Произошла ошибка: ' + error.message);
		} finally {
			if (!download_cancel.isDisabled) {
				closeModal(modal_download.name);
			}
		}
	}
};