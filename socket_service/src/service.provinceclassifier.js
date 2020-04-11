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
























// let wp = ['85611cb3fffffff', '85611c83fffffff', '85611c87fffffff', '8561034bfffffff', '85611c97fffffff', 
//         '8561035bfffffff', '85610343fffffff', '85610353fffffff', '85610227fffffff', '85610237fffffff', 
//         '8561022ffffffff', '85611cc7fffffff', '856103cbfffffff', '85611cbbfffffff', '85611c8ffffffff', 
//         '85611c17fffffff', '85611c13fffffff', '85611c8bfffffff', '85611cabfffffff']

// let nw = ['85611c43fffffff', '85611c7bfffffff', '85611ea7fffffff', '85611c0bfffffff', '85611c0ffffffff', 
//         '85611c03fffffff', '85611c1bfffffff', '85611ccffffffff', '85611ccbfffffff', '85611127fffffff', 
//         '8561112ffffffff', '85611e97fffffff', '85611e87fffffff', '85611e33fffffff', '856118d3fffffff', 
//         '85611c07fffffff', '85611c57fffffff', '85611c47fffffff', '85611ccffffffff', '85611c4ffffffff', 
//         '85611c6bfffffff', '85611eb7fffffff', '85611c53fffffff', '85611c5bfffffff', '85611c4bfffffff', 
//         '85611eb3fffffff', '85611ea3fffffff', '85611c73fffffff', '85611c63fffffff', '85611ebbfffffff', 
//         '85611eabfffffff', '85611eaffffffff', '856118dbfffffff', '85611e37fffffff', '85611e3bfffffff']

// let nc = ['85611ec7fffffff', '85611e03fffffff', '85611e8ffffffff', '85611e8bfffffff', '85611e83fffffff', 
//         '85611e93fffffff', '85611e9bfffffff', '8561116ffffffff', '85611167fffffff', '85611163fffffff', 
//         '8561116bfffffff', '85611ed3fffffff', '856113a7fffffff', '85611173fffffff', '8561110ffffffff', 
//         '8561117bfffffff', '85611147fffffff', '85611157fffffff', '85611143fffffff', '8561110bfffffff', 
//         '8561114ffffffff', '856113b7fffffff', '856113affffffff', '8561111bfffffff', '8561111bfffffff', 
//         '85611337fffffff', '85611323fffffff', '85611327fffffff', '8561114bfffffff', '85611e17fffffff', 
//         '85611e13fffffff', '85611e1bfffffff', '85611e07fffffff', '85611ed7fffffff', '85611ec3fffffff', 
//         '85611edbfffffff', '85611ecffffffff', '85611ecbfffffff', '85611e0bfffffff', '85611e0ffffffff']

// let np = ['85611e53fffffff', '85611e6ffffffff', '8561ad83fffffff', '8561ada3fffffff', '8561ad17fffffff', 
//         '8561ad2bfffffff', '85611ad7fffffff', '8561ad77fffffff', '85611a5bfffffff', '8561132ffffffff', 
//         '85611367fffffff', '85611e57fffffff', '85611e47fffffff', '85611e43fffffff', '85611e5bfffffff', 
//         '85611e73fffffff', '85611e77fffffff', '85611e63fffffff', '85611e7bfffffff', '85611e4ffffffff', 
//         '85611e6bfffffff', '85f02217fffffff', '8561adb3fffffff', '85611e4bfffffff', '8561adb7fffffff', 
//         '8561ada7fffffff', '8561ad87fffffff', '8561ad97fffffff', '8561ad93fffffff', '8561ad9bfffffff', 
//         '8561adbbfffffff', '8561ad8ffffffff', '8561ad8bfffffff', '8561adabfffffff', '8561adaffffffff', 
//         '8561ad13fffffff', '8561ad33fffffff', '8561ad07fffffff', '8561ad03fffffff', '8561ad3bfffffff', 
//         '8561ad0ffffffff', '8561ad2ffffffff', '85611a53fffffff']

// let sp = ['856103d3fffffff', '856103c3fffffff', '856103cffffffff', '856103dbfffffff', '856103d7fffffff', 
//         '8561006ffffffff', '8561006bfffffff', '856102a7fffffff', '856102affffffff', '856102a3fffffff', 
//         '856102b7fffffff', '8561007bfffffff', '856102abfffffff', '856102bbfffffff', '856102b3fffffff', 
//         '8561004ffffffff', '8561004bfffffff', '85610287fffffff', '85610283fffffff', '85610297fffffff', 
//         '85610293fffffff', '8561028bfffffff', '8561029bfffffff', '8561066ffffffff', '85610667fffffff', 
//         '8561066bfffffff', '856115b7fffffff', '856115a3fffffff', '856102d7fffffff', '85610663fffffff']
        
// let sb = ['85611cd7fffffff', '85611c9bfffffff', '85611c93fffffff', '8561022bfffffff', '85610267fffffff', 
//         '8561023bfffffff', '85610223fffffff', '85610233fffffff', '85610207fffffff', '8561020ffffffff', 
//         '85610217fffffff', '85610203fffffff', '8561028ffffffff', '85611cc3fffffff', '85610277fffffff', 
//         '8561020bfffffff', '8561026ffffffff', '85611cd3fffffff']

// let cp = ['8561112bfffffff', '85611177fffffff', '85611123fffffff', '85611137fffffff', '85611cdbfffffff', 
//         '856111affffffff', '85611133fffffff', '8561113bfffffff', '856111abfffffff', '85611107fffffff', 
//         '856111a7fffffff', '856111a3fffffff', '856111bbfffffff', '856111b3fffffff', '856111b7fffffff', 
//         '8561026bfffffff', '85610263fffffff', '85610247fffffff', '8561024ffffffff', '85610273fffffff', 
//         '8561027bfffffff']


// let ep = ['85611037fffffff', '856110affffffff', '85611317fffffff', '8561132bfffffff', '8561133bfffffff', 
//         '85611333fffffff', '856113abfffffff', '856113a3fffffff', '856113bbfffffff', '8561138ffffffff', 
//         '85611387fffffff', '856113b3fffffff', '85611397fffffff', '8561115bfffffff', '85611153fffffff', 
//         '85611027fffffff', '85611517fffffff', '8561156bfffffff', '85611563fffffff', '8561157bfffffff', 
//         '85611573fffffff', '85611547fffffff', '8561156ffffffff', '85611577fffffff', '856115bbfffffff', 
//         '85611103fffffff', '85611113fffffff', '8561118bfffffff', '85611377fffffff', '85611307fffffff', 
//         '856111d7fffffff', '856111c7fffffff', '856111cffffffff', '856111cbfffffff', '856111c3fffffff', 
//         '856111dbfffffff', '856111d3fffffff', '856110a7fffffff', '856110b7fffffff', '8561150bfffffff', 
//         '8561150ffffffff', '85611503fffffff', '85611507fffffff']


// let up = ['8561025bfffffff', '8561024bfffffff', '85610243fffffff', '85610257fffffff', '8561021bfffffff', 
//         '85610213fffffff', '85611197fffffff', '85610253fffffff', '856102cffffffff', '85611523fffffff', 
//         '856102c7fffffff', '856102d3fffffff', '856102c3fffffff', '856102cbfffffff', '856115a7fffffff', 
//         '856102dbfffffff', '856115affffffff', '85611187fffffff', '8561118ffffffff', '85611117fffffff', 
//         '85611183fffffff', '85611193fffffff', '8561119bfffffff', '8561119bfffffff', '85611567fffffff', 
//         '856115abfffffff', '85611527fffffff', '85611537fffffff', '8561152ffffffff', '8561152bfffffff', 
//         '8561153bfffffff', '85611533fffffff']

