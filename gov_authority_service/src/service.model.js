const pool = require('./service.database');
const SERVICE_ENUM = require('./service.enums')

const createGovInsititute = async (params) => {

    const queryStrings = {
        "GOV_INSTITUTE": 'CALL createGovInstitute($1,$2,$3,$4,$5,$6,$7,ST_SetSRID(ST_MakePoint($8,$9),4326),$10,$11,$12,$13)',
        "POLICE" : 'CALL createPoliceStation($1,$2,$3,$4,$5,$6,$7,ST_SetSRID(ST_MakePoint($8,$9),4326),$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)',
        "HOSPITAL": 'CALL createHospital($1,$2,$3,$4,$5,$6,$7,ST_SetSRID(ST_MakePoint($8,$9),4326),$10,$11,$12,$13,$14,$15,$16,$17,$18)',
        "FIRE_STATION": 'CALL createFireStation($1,$2,$3,$4,$5,$6,$7,ST_SetSRID(ST_MakePoint($8,$9),4326),$10,$11,$12,$13,$14,$15)'
    }

    let relatedQueryString;
    let values;
    let displayName;

    if(params.type === SERVICE_ENUM.INSTITUTE_TYPES.Police_station){

        relatedQueryString = queryStrings.POLICE
        values = [params.id,params.type,params.addressLine1,params.addressLine2,params.city,params.district,params.province,
                params.location.lng,params.location.lat,params.email,params.telephoneNumber,params.fax,params.hashedPassword,
                params.police.stationCategory,params.police.motorVehicles,params.police.motorBicycles,params.police.officers,
                params.police.weapons,params.police.cells]
        displayName = "Police Station || "+ params.city

    }else if (params.type === SERVICE_ENUM.INSTITUTE_TYPES.Hospital){

        relatedQueryString = queryStrings.HOSPITAL
        values = [params.id,params.type,params.addressLine1,params.addressLine2,params.city,params.district,params.province,
            params.location.lng,params.location.lat,params.email,params.telephoneNumber,params.fax,params.hashedPassword,params.hospital.hospitalCategory,
            params.hospital.icuBeds,params.hospital.doctors,params.hospital.ambulances,params.hospital.capacity]
        displayName = "Hospital || " + params.city

    }else if (params.type === SERVICE_ENUM.INSTITUTE_TYPES.Fire_station){

        relatedQueryString = queryStrings.FIRE_STATION
        values = [params.id,params.type,params.addressLine1,params.addressLine2,params.city,params.district,params.province,
            params.location.lng,params.location.lat,params.email,params.telephoneNumber,params.fax,params.hashedPassword,params.firestation.fireTrucks,
        params.firestation.fireFighters]
        displayName = "Fire Station || "+ params.city

    }else{

        relatedQueryString = queryStrings.GOV_INSTITUTE
        values = [params.id,params.type,params.addressLine1,params.addressLine2,params.city,params.district,params.province,
            params.location.lng,params.location.lat,params.email,params.telephoneNumber,params.fax,params.hashedPassword]

        if(params.type === SERVICE_ENUM.INSTITUTE_TYPES.Weather_center){
            displayName = "Weather Services Center"
        }else if(params.type === SERVICE_ENUM.INSTITUTE_TYPES.Social_service){
            displayName = "Social Services Office"
        }else{
            displayName = "Provincial council || "+params.province
        }
    }

    await pool.query(relatedQueryString,values)
    return displayName

}

const getInstituteInfo = async (params) => {
    const queryString = ` SELECT government_institute.institute_id, government_institute.institute_type, government_institute.institute_status,
                            institute_credentials.password from government_institute, institute_location, institute_credentials where 
                            (government_institute.institute_id = institute_location.institute_id) and 
                            (government_institute.institute_id = institute_credentials.institute_id) and
                            (institute_location.institute_type = $1) and (institute_location.city = $2) 
                        `
    const values = [params[0],params[1]]
    let result =  await pool.query(queryString,values)
    return result.rows[0]
}

const getLoginInformation = async (params) => {
    const queryString = `SELECT government_institute.institute_status, institute_credentials.password, government_institute.institute_type 
                        from government_institute,institute_credentials where (government_institute.institute_id =$1) and 
                        (government_institute.institute_id = institute_credentials.institute_id)`
    const values = [params[0]]
    const result = await pool.query(queryString,values)
    return result.rows[0]
}

module.exports = {createGovInsititute,getInstituteInfo,getLoginInformation}