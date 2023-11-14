'use strict';

const app = require('../app.js');
const appCreateService = require('../../create_service/app.js')
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Test - Delete a service', function () {
    it('should delete a service from DynamoDB and return a success response', async () => {

        /* ---------------- CREATE A NEW SERVICE AND GET THE serviceID --------------- */

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

        let result = await appCreateService.lambdaHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.ok).to.be.equal(true);

        let serviceIDCreated = response.item.serviceID;

        /* --------------------------- TEST DELETE SERVICE -------------------------- */

        event = {
            queryStringParameters: {
                "serviceID": serviceIDCreated
            }
        };

        result = await app.lambdaHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.ok).to.be.equal(true);
        expect(response.message).to.be.equal('El servicio se ha eliminado correctamente');
    });
});
