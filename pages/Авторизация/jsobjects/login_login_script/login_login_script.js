export default {
	signIn: async () => {
		try {
			clearStore();
			// Получаем данные пользователя
			const [user] = await login_get_user_info.run();
			//console.log(user);			

			// Если пользователь не найден
			if (!user) {
				modal_info_text.setText(`<a>Здравствуйте,</a><br>Пользователь с таким логином не найден!
					`);
				return showModal(modal_info_message.name); // Показываем InfoModal
			}
			// Если учетная запись отключена
			if (user.user_is_user_enabled === false) {
				modal_info_text.setText(`<a>Здравствуйте,</a><br>Ваше учреждение не входит в утверждённый Комитетом по образованию перечень.<br>Предоставлять данные по данной форме не нужно.
					`);
				return showModal(modal_info_message.name); // Показываем InfoModal
			}

			// Если пароль неверный
			if (user.is_valid_password === false) {
				modal_info_text.setText(`<a>Здравствуйте,</a><br>Пользователь с таким логином найден, однако указанный Вами пароль неверный!
					`);
				return showModal(modal_info_message.name); // Показываем InfoModal
			}

			// Проверяем, есть ли у пользователя доступ к нужному отчету
			const requiredReport = 'edu_object_state'; // Отчет, который нужно проверить
			if (!user.available_reports || !user.available_reports.includes(requiredReport)) {
				modal_info_text.setText(
					`<a>Здравствуйте,</a><br>У Вашей учётной записи нет доступа к данному отчету<br>("Надлежащее состояние объектов").<br>Предоставлять данные по данному отчёту Вашему ОУ не нужно.
				`);
				return showModal(modal_info_message.name); // Показываем InfoModal
			}

			// Инициализируем пользовательскую сессию
			const [user_session] = await login_create_user_session.run({ user_id: user.user_id });
			storeValue('user_session', user_session);
			storeValue('selected_report', {
				report_id: 1,
				report_system_name: 'edu_object_state'
			});
			//user.session_id = user_session.user_session_id;
			//console.log(appsmith.store.user_session);
			// Проверка типа учётной записи и переход на соответствующую страницу			
			if (user.group_system_name === 'ou_employee') {
				//Если заходит сотрудник ОУ
				storeValue('user', user);				
				// Инициализация первой записи статуса в report_status_history
				await login_user_init_first_status.run({
					session_id: user_session.user_session_id, // ID сессии
					ou_id:      user.ou_id,          // ИНН учреждения
					report_system_name: 'edu_object_state' // Системное имя отчета
				});
				navigateTo('Отчёт');
			} else if (user.group_system_name === 'iogv_employee' || user.group_system_name === 'controller') { 	
				//Если заходит сотрудник ИОГВ или КО как ИОГВ
				storeValue('superuser', user);
				navigateTo('Мониторинг статусов отчётов');
			} else if (user.group_system_name === 'ko_employee' || user.group_system_name === 'cad_employee') {
				//Если заходит сотрудник КО или ЦАД
				storeValue('superuser', user);
				//showAlert('Для данной функциональности ведутся технические работы. Попробуйте позже','waring')
				navigateTo('Мониторинг статусов отчётов');
			} else {
				showAlert('Ваша учётная запись не относится ни к одному из разрешённых типов', 'warning');
				//console.log(user);
			}
		} catch (error) {
			// Обработка ошибок
			console.error('Ошибка при входе:', error);
			showAlert('Сервер БД недоступен. Попробуйте чуть позже', 'error');
		}
	},
};