const server = require('../server');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'));
const apiAddress = 'http://localhost:3000'

const getPostingsSchema = require('./testSchemas/getPostingsSchema');
const testTitle = "Macbook Pro";
const testDescription ="13.3 display, 512Gt SSD, 16 Gb RAM ";
const testCategory = "Computers";
const testLocation = "Helsinki";          
const testPrice = 1290;
const testDatePosted =  "2021-2-14";
const testDeliveryType = "Delivery";
const testSellerName =  "Donald Duck";
const testEmail =  "donald@email";
const testPhoneNumber = 12451265;

describe('Tests for postings', function() {
    //At first starting server
    before(() => server.start());

    //After tests closing server
    after(() => server.close());

    describe('Make a new posting', function() {
        it('should accept correct posting', async function() {
            await chai.request(apiAddress)
                .post('/postings')
                .send({ 
                    "title": testTitle,
                    "description": testDescription,
                    "category": testCategory,
                    "location": testLocation,            
                    "price": testPrice,
                    "datePosted": testDatePosted,
                    "deliveryType": testDeliveryType,
                    "sellerName": testSellerName,
                    "email": testEmail,
                    "phoneNumber": testPhoneNumber
                })
                .then(response => {
                    expect(response).to.have.status(201);
                })
                .catch(err => {
                    throw err})
        })
    })

    describe('Read posting values', function() {
        it('should return an array of postings ', async function(){
            await chai.request(apiAddress)
                .get('/postings')
                .then(response => {
                    const id = response.body.postings.length -1;
                    console.log(id);                                
                    expect(response).to.have.status(200);
                    expect(response.body).to.be.jsonSchema(getPostingsSchema);
                    expect(response.body.postings[id].title).to.equal(testTitle);                    
                    expect(response.body.postings[id].description).to.equal(testDescription);
                    expect(response.body.postings[id].category).to.equal(testCategory);
                    expect(response.body.postings[id].location).to.equal(testLocation);
                    expect(response.body.postings[id].price).to.equal(testPrice);
                    expect(response.body.postings[id].datePosted).to.equal(testDatePosted);
                    expect(response.body.postings[id].deliveryType).to.equal(testDeliveryType);
                    expect(response.body.postings[id].sellerName).to.equal(testSellerName);
                    expect(response.body.postings[id].email).to.equal(testEmail);
                    expect(response.body.postings[id].phoneNumber).to.equal(testPhoneNumber);
                })
                .catch(error => {
                    throw error;
                })
        })
    })

})