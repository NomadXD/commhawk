//require("dotenv").config();
const userModel = require("../src/service.model");
const uuid = require("uuid/v4");
const RandExp = require("randexp");

/**
 *  Testing for successful user creation when the correct data format is provided
 */
test("Testing the createuser function with correct data format",async ()=>{
    const testUser = {
        id:uuid(),
        nic:new RandExp(/^[0-9]{9}$v/).gen(),
        firstName:"Lahiru",
        lastName: "Udayanga",
        dob:"1997-11-13",
        addressLine1:"5B",
        addressLine2:"Polwatta road",
        city:"Horana",
        email:"lahiru@97gmail.com",
        telephoneNumber:"0775930399",
        hashedPassword:"$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q"
    };
    const result = await userModel.createUser(testUser.id,testUser.nic,testUser.firstName,testUser.lastName,testUser.dob,testUser.addressLine1,
                                                testUser.addressLine2,testUser.city, testUser.email, testUser.telephoneNumber, testUser.hashedPassword);

    expect(result).toBeTruthy();
    
});

/**
 * Testing for error returned when the id format is not uuid 
 */
test("Testing the createuser function with invalid id format",async ()=>{
    const testUser = {
        id:"1123456",
        nic:"934332375c",
        firstName:"Lahiru",
        lastName: "Udayanga",
        dob:"1997-11-13",
        addressLine1:"5B",
        addressLine2:"Polwatta road",
        city:"Horana",
        email:"lahiru@97gmail.com",
        telephoneNumber:"0775930399",
        hashedPassword:"$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q"
    };

    try {
        // eslint-disable-next-line no-unused-vars
        const result = await userModel.createUser(testUser.id,testUser.nic,testUser.firstName,testUser.lastName,testUser.dob,testUser.addressLine1,
            testUser.addressLine2,testUser.city, testUser.email, testUser.telephoneNumber, testUser.hashedPassword);
    } catch (error) {
        expect(error.code).toBe("23514");
    }  
    
});


/**
 * Testing for error returned when one feild is null
 */
test("Testing the createuser function null feild",async ()=>{
    const testUser = {
        id:uuid(),
        nic:new RandExp(/^[0-9]{9}$v/).gen(),
        firstName:"Lahiru",
        lastName: "Udayanga",
        dob:"1997-11-13",
        addressLine1:null,
        addressLine2:"Polwatta road",
        city:"Horana",
        email:"lahiru@97gmail.com",
        telephoneNumber:"0775930399",
        hashedPassword:"$2b$10$KdbtEOKD6IXfxDi9eT4n1.xA2hQFRrl116HX53DshL/XdEhVR2X9q"
    };

    try {
        // eslint-disable-next-line no-unused-vars
        const result = await userModel.createUser(testUser.id,testUser.nic,testUser.firstName,testUser.lastName,testUser.dob,testUser.addressLine1,
            testUser.addressLine2,testUser.city, testUser.email, testUser.telephoneNumber, testUser.hashedPassword);
    } catch (error) {
        expect(error.code).toBe("23502");
    }  
    
});





