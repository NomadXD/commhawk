/* eslint-disable quotes */
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

/**
 * Testing for correct returned object when a valid nic is given
 */
test("Testing the getUserPassword function with valid nic",async ()=>{
    const nic = "853126878v";
    const data = await userModel.getUserPassword(nic);
    const expected = {"password": "$2b$10$jJSd1SNKJEATo2jG/.m77uggMVApA0pJEhQEaxnLfKnEaWeDUPWda", "user_id": "a86c46bc-abab-440d-91be-264ac9442361"};
    expect(data).toEqual(expected);

});

/**
 * Testing for the response when an invalid nic is given
 */
test("Testing the getUserPassword function with invalid nic",async ()=>{
    const nic = "9745681831v";
    const data = await userModel.getUserPassword(nic);
    const expected = undefined;
    expect(data).toEqual(expected);

});

/**
 * Testing for the response when a null value is given as the nic
 */
test("Testing the getUserPassword function with null nic",async ()=>{
    const nic = null;
    const data = await userModel.getUserPassword(nic);
    const expected = undefined;
    expect(data).toEqual(expected);

});

/**
 * Testing for valid response format when a valid id is given
 */
test("Testing the getUserDetails function with valid id",async ()=>{
    const id = "a86c46bc-abab-440d-91be-264ac9442361";
    const user = await userModel.getUserDetails(id);
    user.dob = null;
    const expected = {   user_id: 'a86c46bc-abab-440d-91be-264ac9442361',
                         nic: '853126878v',
                         first_name: 'Lahiru',
                         last_name: 'Udayanga',
                         dob: null,
                         addr_line_1: '5B',
                         addr_line_2: 'Polwatta road',
                         city: 'Horana',
                         email: 'lahiru@97gmail.com',
                         telephone_number: '0775930399' };
    expect(user).toEqual(expected);
    
});


/**
 *  Testing for return type when an invalid id is given
 */
test("Testing the getUserDetails function with an invalid id",async ()=>{
    const id = "b13b39b0-ef43-4rt8-932f-6a1a79e1109d";
    const user = await userModel.getUserDetails(id);
    const expected = undefined;
    expect(user).toEqual(expected);
    
});

/**
 *  Testing for return type when null is given as id
 */
test("Testing the getUserDetails function when null is given as id",async ()=>{
    const id = null;
    const user = await userModel.getUserDetails(id);
    const expected = undefined;
    expect(user).toEqual(expected);
    
});






