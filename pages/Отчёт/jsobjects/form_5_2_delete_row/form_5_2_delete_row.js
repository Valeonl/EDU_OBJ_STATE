export default {
	deleteRowWithDelay: async (rowKey) => {
		try {
			// Выполняем запрос Delete_Row
			await form_5_2_delete.run({ rowKey });
			console.log("Строка удалена успешно.");

			// Задержка 2 секунды
			setTimeout(async () => {
				try {
					await form_5_2_sql_data.run();
					console.log("Данные обновлены после задержки.");
				} catch (error) {
					console.log("Ошибка при выполнении select_contingent:", error);
				}
			}, 500);
		} catch (error) {
			console.log("Ошибка при удалении строки:", error);
		}
	}
};