'use strict';

const app = require('../app.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Test - Get technicians', function () {
    it('should query all technicians saved in DynamoDB and return a success response', async () => {
        const result = await app.lambdaHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);
        
        expect(response).to.be.an('array');
    });
});