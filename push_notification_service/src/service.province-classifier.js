const provinceHashEnum = require("./service.provincehashenum");
const h3 = require("h3-js");

const getCurrentProvince = async (lat,lng) => {
    const RESOLUTION = 5;
    const geoHash = h3.geoToH3(lat,lng,RESOLUTION);
    console.log(geoHash);
    let province;
    if(provinceHashEnum.WP[geoHash]){
        province = "WP";
    }else if (provinceHashEnum.NW[geoHash]){
        province = "NW";
    }else if (provinceHashEnum.NC[geoHash]){
        province = "NC";
    }else if(provinceHashEnum.NP[geoHash]){
        province = "NP";
    }else if (provinceHashEnum.SP[geoHash]){
        province = "SP";
    }else if (provinceHashEnum.SB[geoHash]){
        province = "SB";
    }else if (provinceHashEnum.EP[geoHash]){
        province = "EP";
    }else if (provinceHashEnum.UP[geoHash]){
        province = "UP";
    }

    return province;


};

module.exports = getCurrentProvince;

