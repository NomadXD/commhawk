const express = require("express");
const router = express.Router();
const controller = require("./service.controller");

/**
 * @swagger
 * /api/user/signup:
 *  post:
 *    tags: ['No Authorization']
 *    description: Sign up a user
 *    produces: application/json
 *    parameters:
 *      - name: nic
 *        type: string
 *        in: formData
 *        required: true
 *      - name: firstName
 *        required: true
 *        type: string
 *        in: formData
 *      - name: lastName
 *        required: true
 *        type: string
 *        in: formData
 *      - name: addressLine1
 *        required: true
 *        type: string
 *        in: formData
 *      - name: addressLine2
 *        required: true
 *        type: string
 *        in: formData
 *      - name: dob 
 *        required: true
 *        type: string
 *        in: formData
 *      - name: city
 *        required: true
 *        type: string
 *        in: formData
 *      - name: email
 *        required: true
 *        type: string
 *        in: formData
 *      - name: telephoneNumber
 *        required: true
 *        type: string
 *        in: formData
 *      - name: password
 *        required: true
 *        type: string
 *        in: formData
 *    responses:
 *      '200':
 *        description: Signup
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Signup'
 *      '406':
 *         description: Failed Signup
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Failed-Signup'
 */
router.post("/signup",controller.signUpUserController);

/**
 * @swagger
 * /api/user/signin:
 *  post:
 *    tags: ['No Authorization']
 *    description: Sign in a user
 *    produces: application/json
 *    parameters:
 *      - name: nic
 *        type: string
 *        in: formData
 *        required: true
 *      - name: password
 *        required: true
 *        type: string
 *        in: formData
 *    responses:
 *      '200':
 *        description: SignIn
 *        schema:
 *          type: object
 *          $ref: '#/definitions/SignIn'
 *      '406':
 *         description: Invalid Id
 *         schema:
 *           type: object
 *           $ref: '#/definitions/InvalidId'
 *      '401':
 *         description: Invalid password
 *         schema:
 *           type: object
 *           $ref: '#/definitions/InvalidPassword' 
 * 
 */

router.post("/signin",controller.signInUserController);
router.put("/update",controller.updateUserController);
router.delete("/delete",controller.deleteUserController);

/**
 * @swagger
 * /api/user/{userId}:
 *  get:
 *    tags: ['Authorization']
 *    description: Get the user information
 *    produces: application/json
 *    parameters:
 *      - name: userId
 *        type: string
 *        in: path
 *    responses:
 *      '201':
 *        description: Userdata
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Userdata'
 *      '200':
 *         description: No User 
 *         schema:
 *           type: object
 *           $ref: '#/definitions/NoUserData'
 *  
 */

router.get("/:userId",controller.getUserController);


  /**
   * @swagger
   * definitions:
   *   Signup:
   *     required:
   *       - status
   *       - message
   *       - token
   *       - id
   *     properties:
   *       status:
   *         type: integer
   *         value: 200
   *       message:
   *         type: string
   *         value: Success
   *       token:
   *         type: string
   *       id:
   *         type: string
   * 
   *   Failed-Signup:
   *     required:
   *       - status
   *       - message
   *     properties:
   *       status:
   *         type: integer
   *         value: 406
   *       message: 
   *         type: string
   *         value: Invalid details
   *  
   *   SignIn:
   *     required:
   *       - status
   *       - message
   *       - token
   *       - id
   *     properties:
   *       status:
   *         type: integer
   *         value: 200 
   *       message: 
   *         type: string
   *         value: Success
   *       token:
   *         type: string
   *       id:
   *         type: string
   *    
   *   InvalidId:
   *     required:
   *       - status
   *       - message
   *     properties:
   *       status:
   *          type: integer
   *          value: 406
   *       message:
   *          type: string
   *          value: Invalid NIC number
   *     
   *   InvalidPassword:
   *     required:
   *       - status
   *       - message
   *     properties:
   *       status:
   *          type: integer
   *          value: 401
   *       message:
   *          type: string
   *          value: Invalid password
   * 
   * 
   *   Userdata:
   *    required:
   *      - status
   *      - message
   *      - userdata
   *    properties:
   *      status:
   *        type: integer
   *        value: 201
   *      message:
   *        type: string
   *        value: Success
   *      userdata:
   *        type: object
   *   NoUserData:
   *    required:
   *      - status
   *      - message
   *    properties:
   *      status:
   *        type: integer
   *        value: 200
   *      message:
   *        type: string
   *        value: User not found
   * 
   */

module.exports = router;
