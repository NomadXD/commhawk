const fetch = require("node-fetch");
const app = require("../src/app");
const uuid = require("uuid/v4");
const RandExp = require("randexp");

describe("UDS integration test", () => {
    let server;

    beforeAll(() => {
        server = app.listen(3000);
    });

    afterAll((done) => {
        server.close(done);
    });

    test("Test successful user sign up", async () => {
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
            password:"password"
        };

        const response = await fetch("http://localhost:3000/api/user/signup",{method:"post",body:JSON.stringify(testUser), headers: { "Content-Type": "application/json" }});
        expect(response.status).toBe(200);
    });


    test("Test failed user sign up", async () => {
        const testUser = {
            id:uuid(),
            nic:new RandExp(/^[0-9]{9}$v/).gen(),
            firstName:null,
            lastName: "Udayanga",
            dob:"1997-11-13",
            addressLine1:"5B",
            addressLine2:"Polwatta road",
            city:"Horana",
            email:"lahiru@97gmail.com",
            telephoneNumber:"0775930399",
            password:"password"
        };

        const response = await fetch("http://localhost:3000/api/user/signup",{method:"post",body:JSON.stringify(testUser), headers: { "Content-Type": "application/json" }});
        expect(response.status).toBe(406);
    });

    test("Test successfull user sign in", async () => {
        const testUser = {
            nic:"984977759v",
            password:"password"
        };

        const response = await fetch("http://localhost:3000/api/user/signin",{method:"post",body:JSON.stringify(testUser), headers: { "Content-Type": "application/json" }});
        expect(response.status).toBe(200);
    });

    test("Test invalid password", async () => {
        const testUser = {
            nic:"984977759v",
            password:"passwor"
        };

        const response = await fetch("http://localhost:3000/api/user/signin",{method:"post",body:JSON.stringify(testUser), headers: { "Content-Type": "application/json" }});
        expect(response.status).toBe(401);
    });

    test("Test invalid nic", async () => {
        const testUser = {
            nic:"984977758v",
            password:"password"
        };

        const response = await fetch("http://localhost:3000/api/user/signin",{method:"post",body:JSON.stringify(testUser), headers: { "Content-Type": "application/json" }});
        expect(response.status).toBe(406);
    });


    test("Test successful getUserInformation", async () => {
       
        const response = await fetch("http://localhost:3000/api/user/a86c46bc-abab-440d-91be-264ac9442361").then(res => res.json());
        expect(response.status).toBe(201);
    });

    test("Test getUserInformation", async () => {
       
        const response = await fetch("http://localhost:3000/api/user/a78c46bc-abab-440d-91be-264ac9442361").then(res => res.json());
        expect(response.status).toBe(200);
    });

});

