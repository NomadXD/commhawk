const pool = require('./service.config')

const createUser = async (userId,nic,first_name,last_name,dob,addr_line_1,addr_line_2,city,email,telephone_number,password) => {
    const queryString = 'CALL createUser($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)';
    const values = [userId, nic, first_name, last_name, dob, addr_line_1,
        addr_line_2,city, email, telephone_number, password];
    await pool.query(queryString, values);
    return true;

}


module.exports = {createUser}