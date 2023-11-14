'use strict';

const app = require('../app.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Test - Create a service', function () {
    it('should save a service to DynamoDB and return a success response', async () => {
        event = {
            body: JSON.stringify({
                "category": "MicroElectrónica",
                "brand": "Apple",
                "model": "Iphone 14",
                "imei": 908493993332235,
                "damage": "Problema de carga",
                "description": "No reconoce bien el cargador",
                "price": 300000,
                "customerName": "Fulano Perez",
                "customerPhoneNumber": "+573103456789",
                "customerEmail": "fulanope@gmail.com"
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
        expect(response.message).to.be.equal('El servicio se ha creado correctamente');
    });
});
