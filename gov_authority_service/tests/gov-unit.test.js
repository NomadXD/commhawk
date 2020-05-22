const govModel = require("../src/service.model");
const uuid = require("uuid/v4");
const RandExp = require("randexp");

test("Testing the function createGovInstitute for police", async () => {
    const testInstitute = {
        "id":uuid(),
        "type":1,
        "addressLine1":"Royal Lane",
        "addressLine2":"Horana",
        "city":new RandExp(/^[A-Z]{9}$/).gen(),
        "district":"Kalutara",
        "province": "WP",
        "location":{"lng":80.069006,"lat":6.714997},
        "email":"hoarana@police.lk",
        "telephoneNumber":"0342255180",
        "fax":"0342255180",
        "hashedPassword":"$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q",
        "police":{
        "stationCategory":"B",
        "motorVehicles":8,
        "motorBicycles":13,
        "officers":26,
        "weapons":12,
        "cells":4
        }
    };
    const result = await govModel.createGovInsititute(testInstitute);
    expect(result).not.toBeNull();

});


test("Testing the function createGovInstitute for hospital", async () => {
    const testInstitute = {
        "id":uuid(),
        "type":2,
        "addressLine1":"Hospital Lane",
        "addressLine2":"Horana",
        "city":new RandExp(/^[A-Z]{9}$/).gen(),
        "district":"Kalutara",
        "province": "WP",
        "location":{"lng":80.066589,"lat":6.710836},
        "email":"hoarana@health.gov.lk",
        "telephoneNumber":"0342265152",
        "fax":"0342265152",
        "hashedPassword":"$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q",
        "hospital":{
        "hospitalCategory":2,
        "icuBeds":8,
        "doctors":36,
        "ambulances":4,
        "capacity":120
        }
    };
    const result = await govModel.createGovInsititute(testInstitute);
    expect(result).not.toBeNull();

});

test("Testing the function createGovInstitute for firestation", async () => {
    const testInstitute = {
        "id":uuid(),
        "type":4,
        "addressLine1":"Main street Lane",
        "addressLine2":"Horana",
        "city":new RandExp(/^[A-Z]{9}$/).gen(),
        "district":"Kalutara",
        "province": "WP",
        "location":{"lng":80.062324,"lat":6.714721},
        "email":"hoarana@health.gov.lk",
        "telephoneNumber":"0342266888",
        "fax":"0342266888",
        "hashedPassword":"$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q",
        "firestation":{
        "fireTrucks":2,
        "fireFighters":10
        }
    };
    const result = await govModel.createGovInsititute(testInstitute);
    expect(result).not.toBeNull();

});

test("Testing the function createGovInstitute for weather center", async () => {
    const testInstitute = {
        "id":uuid(),
        "type":3,
        "addressLine1":"Main street Lane",
        "addressLine2":"Horana",
        "city":new RandExp(/^[A-Z]{9}$/).gen(),
        "district":"Kalutara",
        "province": "WP",
        "location":{"lng":80.062324,"lat":6.714721},
        "email":"hoarana@health.gov.lk",
        "telephoneNumber":"0342266888",
        "fax":"0342266888",
        "hashedPassword":"$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q"
    };
    const result = await govModel.createGovInsititute(testInstitute);
    expect(result).not.toBeNull();

});

test("Testing the function createGovInstitute for provincial council", async () => {
    const testInstitute = {
        "id":uuid(),
        "type":5,
        "addressLine1":"Main street Lane",
        "addressLine2":"Horana",
        "city":new RandExp(/^[A-Z]{9}$/).gen(),
        "district":"Kalutara",
        "province": "WP",
        "location":{"lng":80.062324,"lat":6.714721},
        "email":"hoarana@health.gov.lk",
        "telephoneNumber":"0342266888",
        "fax":"0342266888",
        "hashedPassword":"$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q"
    };
    const result = await govModel.createGovInsititute(testInstitute);
    expect(result).not.toBeNull();

});

test("Testing the function createGovInstitute social services office", async () => {
    const testInstitute = {
        "id":uuid(),
        "type":6,
        "addressLine1":"Main street Lane",
        "addressLine2":"Horana",
        "city":new RandExp(/^[A-Z]{9}$/).gen(),
        "district":"Kalutara",
        "province": "WP",
        "location":{"lng":80.062324,"lat":6.714721},
        "email":"hoarana@health.gov.lk",
        "telephoneNumber":"0342266888",
        "fax":"0342266888",
        "hashedPassword":"$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q"
    };
    const result = await govModel.createGovInsititute(testInstitute);
    expect(result).not.toBeNull();

});

test("Testing the function getLoginInformation for valid id", async () => {
    const testInstitute = ["17d47fbb-17c4-4a7a-9501-0ad7cf0a3236"];
    const result = await govModel.getLoginInformation(testInstitute);
    const expected = { institute_status: 1,
                    password:"$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q",
                    institute_type: 2 };
    expect(result).toEqual(expected);

});


test("Testing the function getLoginInformation for invalid id", async () => {
    const testInstitute = ["17d47fbb-17c4-677a-9501-0ad7cf0a3236"];
    const result = await govModel.getLoginInformation(testInstitute);
    expect(result).toEqual(undefined);

});

test("Testing the function getRelatedInstitute 1", async () => {
    const location = {"lng":80.069006,"lat":6.714997};
    const categories = [1];
    const result = await govModel.getRelatedInsitute(location, categories);
    expect(result).not.toBeNull();

});

test("Testing the function getRelatedInstitute 2", async () => {
    const location = {"lng":80.069006,"lat":6.714997};
    const categories = [2];
    const result = await govModel.getRelatedInsitute(location, categories);
    expect(result).not.toBeNull();

});

test("Testing the function getRelatedInstitute 3", async () => {
    const location = {"lng":80.069006,"lat":6.714997};
    const categories = [3];
    const result = await govModel.getRelatedInsitute(location, categories);
    expect(result).not.toBeNull();

});

test("Testing the function getRelatedInstitute 4", async () => {
    const location = {"lng":80.069006,"lat":6.714997};
    const categories = [4];
    const result = await govModel.getRelatedInsitute(location, categories);
    expect(result).not.toBeNull();

});

test("Testing the function getRelatedInstitute 5", async () => {
    const location = {"lng":80.069006,"lat":6.714997};
    const categories = [5];
    const result = await govModel.getRelatedInsitute(location, categories);
    expect(result).not.toBeNull();

});

test("Testing the function getRelatedInstitute 6", async () => {
    const location = {"lng":80.069006,"lat":6.714997};
    const categories = [6];
    const result = await govModel.getRelatedInsitute(location, categories);
    expect(result).not.toBeNull();

});


test("Testing the function getRelatedInstitute 1,2", async () => {
    const location = {"lng":80.069006,"lat":6.714997};
    const categories = [1,2];
    const result = await govModel.getRelatedInsitute(location, categories);
    expect(result).not.toBeNull();

});

test("Testing the function getRelatedInstitute 1,2, 3", async () => {
    const location = {"lng":80.069006,"lat":6.714997};
    const categories = [1,2,3];
    const result = await govModel.getRelatedInsitute(location, categories);
    expect(result).not.toBeNull();

});

test("Testing the function getRelatedInstitute 1,2,4", async () => {
    const location = {"lng":80.069006,"lat":6.714997};
    const categories = [1,2,4];
    const result = await govModel.getRelatedInsitute(location, categories);
    expect(result).not.toBeNull();

});

test("Testing the function getRelatedInstitute 2,4", async () => {
    const location = {"lng":80.069006,"lat":6.714997};
    const categories = [2,4];
    const result = await govModel.getRelatedInsitute(location, categories);
    expect(result).not.toBeNull();

});

test("Testing the function getAll",async () => {
    const result = await govModel.getAll();
    expect(result).not.toBeNull();
});












