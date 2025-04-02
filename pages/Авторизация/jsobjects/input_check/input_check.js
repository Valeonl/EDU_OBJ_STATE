export default {
	btn_signInonClick () {
		// Проверяем, пустые ли поля
		if (!input_inn.isValid || !input_password.isValid) {

			return false; // Прерываем выполнение
		}

		// Если оба поля заполнены, выводим сообщение об успехе
		//showAlert("Данные успешно отправлены!", "success");
		return true; // Продолжаем выполнение
	}
}
