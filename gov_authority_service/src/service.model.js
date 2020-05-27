const pool = require("./service.database");
const SERVICE_ENUM = require("./service.enums");

const createGovInsititute = async (params) => {

    const queryStrings = {
        "GOV_INSTITUTE": "CALL createGovInstitute($1,$2,$3,$4,$5,$6,$7,ST_SetSRID(ST_MakePoint($8,$9),4326),$10,$11,$12,$13)",
        "POLICE" : "CALL createPoliceStation($1,$2,$3,$4,$5,$6,$7,ST_SetSRID(ST_MakePoint($8,$9),4326),$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)",
        "HOSPITAL": "CALL createHospital($1,$2,$3,$4,$5,$6,$7,ST_SetSRID(ST_MakePoint($8,$9),4326),$10,$11,$12,$13,$14,$15,$16,$17,$18)",
        "FIRE_STATION": "CALL createFireStation($1,$2,$3,$4,$5,$6,$7,ST_SetSRID(ST_MakePoint($8,$9),4326),$10,$11,$12,$13,$14,$15)"
    };

    let relatedQueryString;
    let values;
    let displayName;

    if(params.type === SERVICE_ENUM.INSTITUTE_TYPES.Police_station){

        relatedQueryString = queryStrings.POLICE;
        values = [params.id,params.type,params.addressLine1,params.addressLine2,params.city,params.district,params.province,
                params.location.lng,params.location.lat,params.email,params.telephoneNumber,params.fax,params.hashedPassword,
                params.police.stationCategory,params.police.motorVehicles,params.police.motorBicycles,params.police.officers,
                params.police.weapons,params.police.cells];
        displayName = "Police Station || "+ params.city;

    }else if (params.type === SERVICE_ENUM.INSTITUTE_TYPES.Hospital){

        relatedQueryString = queryStrings.HOSPITAL;
        values = [params.id,params.type,params.addressLine1,params.addressLine2,params.city,params.district,params.province,
            params.location.lng,params.location.lat,params.email,params.telephoneNumber,params.fax,params.hashedPassword,params.hospital.hospitalCategory,
            params.hospital.icuBeds,params.hospital.doctors,params.hospital.ambulances,params.hospital.capacity];
        displayName = "Hospital || " + params.city;

    }else if (params.type === SERVICE_ENUM.INSTITUTE_TYPES.Fire_station){

        relatedQueryString = queryStrings.FIRE_STATION;
        values = [params.id,params.type,params.addressLine1,params.addressLine2,params.city,params.district,params.province,
            params.location.lng,params.location.lat,params.email,params.telephoneNumber,params.fax,params.hashedPassword,params.firestation.fireTrucks,
        params.firestation.fireFighters];
        displayName = "Fire Station || "+ params.city;

    }else{

        relatedQueryString = queryStrings.GOV_INSTITUTE;
        values = [params.id,params.type,params.addressLine1,params.addressLine2,params.city,params.district,params.province,
            params.location.lng,params.location.lat,params.email,params.telephoneNumber,params.fax,params.hashedPassword];

        if(params.type === SERVICE_ENUM.INSTITUTE_TYPES.Weather_center){
            displayName = "Weather Services Center";
        }else if(params.type === SERVICE_ENUM.INSTITUTE_TYPES.Social_service){
            displayName = "Social Services Office";
        }else{
            displayName = "Provincial council || "+params.province;
        }
    }

    await pool.query(relatedQueryString,values);
    return displayName;

};

// const getInstituteInfo = async (params) => {
//     const queryString = ` SELECT government_institute.institute_id, government_institute.institute_type, government_institute.institute_status,
//                             institute_credentials.password from government_institute, institute_location, institute_credentials where 
//                             (government_institute.institute_id = institute_location.institute_id) and 
//                             (government_institute.institute_id = institute_credentials.institute_id) and
//                             (institute_location.institute_type = $1) and (institute_location.city = $2) 
//                         `
//     const values = [params[0],params[1]]
//     let result =  await pool.query(queryString,values)
//     return result.rows[0]
// }

const getLoginInformation = async (params) => {
    const queryString = `SELECT government_institute.institute_status, institute_credentials.password, government_institute.institute_type 
                        from government_institute,institute_credentials where (government_institute.institute_id =$1) and 
                        (government_institute.institute_id = institute_credentials.institute_id)`;
    const values = [params[0]];
    const result = await pool.query(queryString,values);
    return result.rows[0];
};

const getRelatedInsitute = async (location,categories) => {
    var institutes = [];
    console.log(categories);
    for await (const category of categories){

        if(category === SERVICE_ENUM.INSTITUTE_TYPES.Police_station){

            const policeQueryString = "SELECT * from getPoliceStation($1,$2)";
            const values = [location.lng,location.lat];
            const result = await pool.query(policeQueryString,values);
            result.rows[0]["displayName"] = "Police station - "+ result.rows[0].city;
            result.rows[0]["instituteType"] = 1;
            institutes.push(result.rows[0]);

            const policeHQ = {"institute_id":"b13b39b0-ef43-4df8-932f-6a1a79e1109d","displayName":"Police HQ","institute_type":7};
            institutes.push(policeHQ);
    
        }else if(category === SERVICE_ENUM.INSTITUTE_TYPES.Hospital){

            const hospitalQueryString = "SELECT * from getHospital($1,$2)";
            const values = [location.lng,location.lat];
            const result = await pool.query(hospitalQueryString,values);
            result.rows[0]["displayName"] = result.rows[0].hospital_type+" - "+result.rows[0].city;
            result.rows[0]["instituteType"] = 2;
            institutes.push(result.rows[0]);

            const hospitalHQ = {"institute_id":"ade39ee6-ed99-4002-a655-35308d460f97","displayName":"Hospital HQ","institute_type":8};
            institutes.push(hospitalHQ);
        
        }else if (category === SERVICE_ENUM.INSTITUTE_TYPES.Fire_station){

            const fireStationQueryString = "SELECT * from getFireStation($1,$2)";
            const values = [location.lng,location.lat];
            const result = await pool.query(fireStationQueryString,values);
            result.rows[0]["displayName"] = "Fire station - "+ result.rows[0].city;
            result.rows[0]["instituteType"] = 4;
            institutes.push(result.rows[0]);

            const firestationHQ = {"institute_id":"2db8c542-18c8-465a-8d74-46e8338f4e43","displayName":"Firestation HQ","institute_type":9};
            institutes.push(firestationHQ);
            
        }else if (category === SERVICE_ENUM.INSTITUTE_TYPES.Weather_center){

            const result = await pool.query("SELECT institute_id from government_institute where institute_type = 3");
            result.rows[0]["displayName"] = "Weather Services Center";
            institutes.push(result.rows[0]);

        }else if (category === SERVICE_ENUM.INSTITUTE_TYPES.Social_service){

            const result = await pool.query("SELECT institute_id from government_institute where institute_type = 6");
            result.rows[0]["displayName"] = "Social Services Center";
            institutes.push(result.rows[0]);
        }


    }

    return institutes;
};

const getAll = async () => {
    const queryString = `SELECT
                            (SELECT json_agg(sq.*)
                            FROM (SELECT p.institute_id, p.city
                                FROM police p 
                            ) sq
                            ) AS police,
                            (SELECT json_agg(sq.*)
                            FROM (SELECT h.institute_id, h.hospital_category, h.city 
                                FROM hospital h
                            ) sq
                            ) AS hospital,
                            (SELECT json_agg(sq.*)
                            FROM (SELECT f.institute_id, f.city 
                                FROM firestation f
                            ) sq
                            ) AS fire_station,
                            (SELECT json_agg(sq.*)
                            FROM (SELECT g.institute_id 
                                FROM government_institute g
                                WHERE institute_type = 3

                            ) sq
                            ) AS weather_center,
                            (SELECT json_agg(sq.*)
                            FROM (SELECT g.institute_id, i.province
                                FROM government_institute g, institute_location i
                                WHERE g.institute_type = 5 and g.institute_id = i.institute_id 
                            ) sq
                            ) AS provincial_council,
                            (SELECT json_agg(sq.*)
                            FROM (SELECT g.institute_id
                                FROM government_institute g
                                WHERE g.institute_type = 6 
                            ) sq
                            ) AS social_service,
                            (SELECT json_agg(sq.*)
                            FROM (SELECT g.institute_id
                                FROM government_institute g
                                WHERE g.institute_type = 7 
                            ) sq
                            ) AS police_HQ,
                            (SELECT json_agg(sq.*)
                            FROM (SELECT g.institute_id
                                FROM government_institute g
                                WHERE g.institute_type = 8 
                            ) sq
                            ) AS hospital_HQ,
                            (SELECT json_agg(sq.*)
                            FROM (SELECT g.institute_id
                                FROM government_institute g
                                WHERE g.institute_type = 9 
                            ) sq
                            ) AS firestation_HQ
                            `;

    const result = await pool.query(queryString);
    return result.rows[0];
                    
};

const getInstituteInfo = async (instituteId,category) => {
    let queryString;
    if(category === SERVICE_ENUM.INSTITUTE_TYPES.Police_station){

        queryString = `SELECT p.institute_id, p.addr_line_1, p.addr_line_2, p.city, p.district, p.province, ST_AsGeoJSON(p.location),
                            c.station_category, p.motor_vehicles, p.motor_biycles, p.officers, p.weapons, p.cells, i.email, i.phone_number, i.fax 
                            from police p, police_station_category c, institute_contact_info i
                            where (p.institute_id = $1) and (p.station_category = c.station_category_id) and (p.institute_id = i.institute_id)`;

    }else if (category === SERVICE_ENUM.INSTITUTE_TYPES.Hospital){

        queryString = `SELECT h.institute_id, h.addr_line_1, h.addr_line_2, h.city, h.district, h.province, ST_AsGeoJSON(h.location), c.hospital_category,
                            h.icu_beds, h.doctors, h.ambulances, h.capacity, i.email, i.phone_number, i.fax   
                            from hospital h, hospital_category c, institute_contact_info i
                            where (h.hospital_category = c.hospital_category_code) and h.institute_id = $1 and (h.institute_id = i.institute_id)`;
       
    }else if(category === SERVICE_ENUM.INSTITUTE_TYPES.Fire_station){

        queryString = `SELECT f.institute_id, f.addr_line_1, f.addr_line_2, f.city, f.district, f.province, ST_AsGeoJSON(f.location), f.fire_trucks,
                            f.fire_fighters, i.email, i.phone_number, i.fax  from firestation f, institute_contact_info i where f.institute_id = $1 and
                            (f.institute_id = i.institute_id)`;

        
    }else{

        queryString = `SELECT l.addr_line_1, l.addr_line_2, l.city, l.district, l.province, ST_AsGeoJSON(l.location), c.email, c.phone_number,
                            c.fax from institute_location l, institute_contact_info c
                            where (l.institute_id = c.institute_id) and l.institute_id = $1`;

    }

    const values = [instituteId];
    const result = await pool.query(queryString,values);
    return result.rows[0];


};

const getUnverifiedInstitutes = async (hq_type) => {
    let queryString;
    if (SERVICE_ENUM.INSTITUTE_TYPES.Police_HQ === hq_type){
        queryString = `SELECT p.institute_id, p.addr_line_1, p.addr_line_2, p.city, p.district, p.province, 
                        pc.station_category,p.motor_vehicles,p.motor_biycles,p.officers,p.weapons, p.cells from police p, 
                        government_institute g, police_station_category pc where g.institute_status = 1 and pc.station_category_id = p.station_category
                        and g.institute_id = p.institute_id`;
    }else if (SERVICE_ENUM.INSTITUTE_TYPES.Hospital_HQ === hq_type){
        queryString = `SELECT h.institute_id, h.addr_line_1, h.addr_line_2, h.city, h.district, h.province, hc.hospital_category, h.icu_beds, h.doctors,
                        h.ambulances, h.capacity from hospital h, government_institute g, hospital_category hc where g.institute_status = 1 and
                        hc.hospital_category_code = h.hospital_category and g.institute_id = h.institute_id`;
    }else if (SERVICE_ENUM.INSTITUTE_TYPES.Firestation_HQ === hq_type){
        queryString = `SELECT f.institute_id, f.addr_line_1, f.addr_line_2, f.city, f.district, f.province, f.fire_trucks, f.fire_fighters from firestation f,
                        government_institute g where g.institute_status = 1 and g.institute_id = f.institute_id`;
    }
    const result = await pool.query(queryString);
    return result.rows;


};

const verifyInstitute = async (instituteId) => {

    // TODO check for account types (police HQ => police only)

    const queryString = "UPDATE government_institute SET institute_status = 2 where institute_id = $1";
    const values = [instituteId];
    await pool.query(queryString, values);
    return true;

};

const updateInstituteContact = async (data) => {

    const queryString = `UPDATE institute_contact_info SET
                        email = $1,
                        phone_number = $2,
                        fax = $3
                        where institute_id = $4`;
    const values = [data.email,data.telephoneNumber, data.fax, data.token.id];
    await pool.query(queryString, values);
    return true;

};

const updateLocation = async (data) => {
    const queryString = `UPDATE institute_location SET
                        addr_line_1 = $1,
                        addr_line_2 = $2,
                        city = $3,
                        district = $4,
                        province = $5,
                        location = ST_SetSRID(ST_MakePoint($6,$7),4326)
                        where institute_id = $8`;
    const values = [data.addressLine1, data.addressLine2, data.city, data.district, data.province, 
                    data.location.lng, data.location.lat, data.token.id];

    await pool.query(queryString, values);
    return true;
};

const updateInstituteInfo = async (data) => {
    let queryString;
    let values;
    if (data.token.type === SERVICE_ENUM.INSTITUTE_TYPES.Police_station){
        queryString = `UPDATE police SET
                        station_category = $1,
                        motor_vehicles = $2,
                        motor_biycles = $3,
                        officers = $4,
                        weapons = $5,
                        cells = $6
                        where institute_id = $7`;
        values = [data.stationCategory, data.motorVehicles, data.motorBicycles, data.officers, data.weapons, data.cells, data.token.id];
        await pool.query(queryString, values);
        return true;
    }else if (data.token.type === SERVICE_ENUM.INSTITUTE_TYPES.Hospital){
        queryString = `UPDATE hospital SET
                        hospital_category = $1,
                        icu_beds = $2,
                        doctors = $3,
                        ambulances = $4,
                        capacity = $5
                        where institute_id = $6`;
        values = [data.hospitalCategory, data.icuBeds, data.doctors, data.ambulances, data.capacity, data.token.id];
        await pool.query(queryString, values);
        return true;
    }else if (data.token.type === SERVICE_ENUM.INSTITUTE_TYPES.Fire_station){
        queryString = `UPDATE firestation SET
                        fire_trucks = $1,
                        fire_fighters = $2
                        where institute_id = $3`;
        values = [data.fireTrucks, data.fireFighters, data.token.id];
        await pool.query(queryString,values);
        return true;
    }else{
        return false;
    }


};


module.exports = {createGovInsititute,getInstituteInfo,getLoginInformation,getRelatedInsitute, getAll, 
                getUnverifiedInstitutes, verifyInstitute, updateInstituteContact, updateLocation, updateInstituteInfo};