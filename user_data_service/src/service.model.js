const pool = require("./service.config");

const createUser = async (userId,nic,first_name,last_name,dob,addr_line_1,addr_line_2,city,email,telephone_number,password) => {
    const queryString = "CALL createUser($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)";
    const values = [userId, nic, first_name, last_name, dob, addr_line_1,
        addr_line_2,city, email, telephone_number, password];
    await pool.query(queryString, values);
    return true;

};


const getUserPassword = async (nic) => {
    const queryString = "SELECT usercredential.user_id,usercredential.password from usercredential,userdetail where (usercredential.user_id = userdetail.user_id) and (userdetail.nic) = $1";
    const values = [nic];
    let result = await pool.query(queryString,values);
    console.log(result.rows[0]);
    return result.rows[0];
};

const getUserDetails = async (id) => {
    console.log(id);
    const queryString = "SELECT * from userdetail where user_id = $1";
    const values = [id];
    const result = await pool.query(queryString,values);
    return result.rows[0];
};


module.exports = {createUser,getUserPassword,getUserDetails};