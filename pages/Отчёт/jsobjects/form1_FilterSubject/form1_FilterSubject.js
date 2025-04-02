export default {
		filterData(selectedSubject) {
        const allData = form_1_sql_data.data;
        const filteredData = selectedSubject
            ? allData.filter(item => item.subject === selectedSubject)
            : allData;
        form_1.setData(filteredData);
    }
}