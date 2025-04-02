export default {
  async myFun2() {
    // Получаем данные
    const report_data = report_status_last.data;
    console.log("Все данные:", report_data);

    // Фильтрация данных
    const filteredData = report_data.filter(record => {
      console.log("Текущая запись:", record);

      // Условие 1: Фильтрация по ИНН (если выбран)
      const isLoginMatch = monitoring_select_inn.selectedOptionValue 
        ? record.login === monitoring_select_inn.selectedOptionValue 
        : true;
      console.log("ИНН совпадает:", isLoginMatch);

      // Условие 2: Фильтрация по статусу (если выбран)
      const isStatusMatch = monitoring_status_filter_selec.selectedOptionValue 
        ? record.describe === monitoring_status_filter_selec.selectedOptionValue 
        : true;
      console.log("Статус совпадает:", isStatusMatch);

      // Возвращаем true, если оба условия выполнены
      const result = isLoginMatch && isStatusMatch;
      console.log("Запись прошла фильтрацию:", result);
      return result;
    });

    console.log("Отфильтрованные данные:", filteredData);
  }
};