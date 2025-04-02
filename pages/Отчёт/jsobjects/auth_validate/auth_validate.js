export default {
	// Функция для отправки польхователя на правильные страницы
	async auth() {
		if (appsmith.user) {
			return
		}
		// Проверяем, есть ли данные о пользователе или суперпользователе
		const user = appsmith.store.user; // Обычный пользователь
		const superuser = appsmith.store.superuser; // Суперпользователь

		// Если нет данных ни о пользователе, ни о суперпользователе
		if (!user && !superuser) {
			navigateTo('Авторизация', {}, 'SAME_WINDOW');
			return;
		}

		// Определяем тип учетной записи
		const userType = superuser ? superuser.system_name : user.system_name;

		// Если тип учетной записи не соответствует ни одному из допустимых
		if (
			userType !== 'OUEmployee' && // Сотрудник ОУ
			userType !== 'IOGVEmployee' && // Сотрудник ИОГВ
			userType !== 'KOEmployee' && // Сотрудник КО
			userType !== 'CADEmployee' // Сотрудник CAD
		) {
			navigateTo('Авторизация', {}, 'SAME_WINDOW');
			return;
		}

		// Для всех остальных типов (ИОГВ, КО, CAD) ничего не делаем
		// Они остаются на текущей странице
	},
};