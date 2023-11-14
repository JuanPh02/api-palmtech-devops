'use strict';

const app = require('../app.js');
const appCreateService = require('../../create_technician/app.js')
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Test - Update a technician', function () {
    it('should update a technician from DynamoDB and return a success response', async () => {

        /* ---------------- CREATE A NEW TECHNICIAN AND GET THE technicianID --------------- */

        event = {
            body: JSON.stringify({
                'documentID': '100200300',
                'name': 'Felipe',
                'lastname': 'Marin',
                'sector': 'Cambio de Piezas',
                'birthday': '11/08/2000',
                'address': 'Calle 30 #20 - 12',
                'email': 'pimar@gmail.com',
                'phone': '+573123458909'
            }),
        };

        let result = await appCreateService.lambdaHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.ok).to.be.equal(true);

        let technicianCreated = response.item;

        /* --------------------------- TEST UPDATE TECHNICIAN -------------------------- */

        event = {
            body: JSON.stringify({
                'technicianID': technicianCreated.technicianID,
                'documentID': technicianCreated.documentID,
                'name': 'Juan Felipe',
                'lastname': technicianCreated.name,
                'sector': technicianCreated.sector,
                'birthday': technicianCreated.birthday,
                'address': 'Calle 54 #30 - 22',
                'email': 'juanfmar@gmail.com',
                'phone': technicianCreated.phone
            }),
        };

        result = await app.lambdaHandler(event, context)
        
        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.ok).to.be.equal(true);
        expect(response.message).to.be.equal('El técnico se ha actualizado correctamente');
        expect(response.updatedTechnician.name).to.be.equal('Juan Felipe');
        expect(response.updatedTechnician.address).to.be.equal('Calle 54 #30 - 22');
        expect(response.updatedTechnician.email).to.be.equal('juanfmar@gmail.com');
    });
});
