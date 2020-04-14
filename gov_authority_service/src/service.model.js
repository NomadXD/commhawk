const pool = require('./service.database');

const createGovInsititute = async (params) => {
    const queryString = 'CALL createGovInstitute($1,$2,$3,$4,$5,$6,$7,ST_SetSRID(ST_MakePoint($8,$9),4326),$10,$11,$12,$13)'
    const values = [params[0],params[1],params[2],params[3],params[4],params[5],params[6],params[7],params[8],params[9],params[10],params[11],params[12]]
    await pool.query(queryString,values)
    return true

}

module.exports = {createGovInsititute}