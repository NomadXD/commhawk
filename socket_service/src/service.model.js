const pool = require("./service.database");
const getProvince = require("./service.provinceclassifier");

const saveReportData = async (report) => {
    const province = await getProvince(report.location.lat, report.location.lng);
    console.log(report);
    const queryString = "CALL saveReport($1, $2, $3, $4, $5, $6)";
    const values = [report.categories, ["Murder" ,"Theft"], report.id, report.title, report.description,province];
    await pool.query(queryString, values);
    return true;

};

module.exports = {saveReportData};
