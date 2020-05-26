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
    return result.rows[0];
};

const getUserDetails = async (id) => {
    const queryString = "SELECT * from userdetail where user_id = $1";
    const values = [id];
    const result = await pool.query(queryString,values);
    return result.rows[0];
};

const updateUserDetails = async (addressLine1, addressLine2, city, email, telephoneNumber, userId) => {
    const queryString = `UPDATE userdetail SET
                        addr_line_1 = $1,
                        addr_line_2 = $2,
                        city = $3,
                        email = $4,
                        telephone_number = $5
                        where user_id = $6`;
    const values = [addressLine1, addressLine2, city, email, telephoneNumber, userId];
    await pool.query(queryString, values);
    return true;
};


module.exports = {createUser,getUserPassword,getUserDetails, updateUserDetails};