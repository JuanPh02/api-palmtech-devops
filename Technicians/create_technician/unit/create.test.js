'use strict';

const app = require('../app.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Test - Create a technician', function () {
    it('should save a technician to DynamoDB and return a success response', async () => {
        event = {
            body: JSON.stringify({
                "documentID": "101202303",
                "name": "Camilo",
                "lastname": "Lopera",
                "sector": "MicroElectrónica",
                "birthday": "28/04/1998",
                "address": "Calle 30 #20 - 12",
                "email": "camilop@gmail.com",
                "phone": "+573123458909"
            }),
        };

        const result = await app.lambdaHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.ok).to.be.equal(true);
        expect(response.item).to.be.an('object');
        expect(response.message).to.be.equal('El técnico se ha creado correctamente');
    });
});
