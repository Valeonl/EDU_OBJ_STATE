export default {
    async export_excel() {
        try {
            showModal(modal_download.name);
            progress_bar_excel.setProgress(0);
            download_status_text.setText("Начинаем формирование отчёта...");

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(templateConfig.name);

            // Устанавливаем ширину колонок
            templateConfig.columns.forEach(col => {
                worksheet.getColumn(col.key).width = col.width;
            });

            // Добавляем статические элементы
            templateConfig.staticElements.forEach(element => {
                const cell = worksheet.getCell(element.cell);
                cell.value = element.value;
                applyCellStyle(cell, element.style);
                
                if (element.merge) {
                    worksheet.mergeCells(element.merge);
                }
            });

            // Добавляем заголовки таблицы
            templateConfig.tableHeaders.forEach(headerRow => {
                worksheet.getRow(headerRow.startRow).height = headerRow.height;
                
                headerRow.cells.forEach(header => {
                    const cell = worksheet.getCell(header.cell);
                    cell.value = header.value;
                    applyCellStyle(cell, header.style);
                    mergeCells(worksheet, header.cell, header.rowspan, header.colspan);
                });
            });

            // Добавляем примечание
            const lastRow = worksheet.lastRow.number + 2;
            const footerCell = worksheet.getCell(`C${lastRow}`);
            footerCell.value = templateConfig.footer.content;
            applyCellStyle(footerCell, templateConfig.footer.style);
            worksheet.mergeCells(`C${lastRow}:W${lastRow}`);

            // Сохранение и выгрузка файла
            const currentDate = new Date().toISOString().split('T')[0];
            const fileName = `План-график_${currentDate}.xlsx`;

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
            console.error(error);
        } finally {
            if (!download_cancel.isDisabled) {
                closeModal(modal_download.name);
            }
        }
    }
};