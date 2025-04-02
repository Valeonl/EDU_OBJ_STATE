export default {
		filterData(selectedClass) {
        const allData = form_1_2_sql_data.data;
        const filteredData = selectedClass
            ? allData.filter(item => item.Класс === selectedClass)
            : allData;
        form_1.setData(filteredData);
    }
}