'use strict';

const appCreate = require('../Technicians/create_technician/app.js');
const appDelete = require('../Technicians/delete_technician/app.js');
const appGet = require('../Technicians/get_technicians/app.js');
const appUpdate = require('../Technicians/update_technician/app.js');
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

      const result = await appCreate.lambdaHandler(event, context)

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


describe('Test - Delete a technician', function () {
  it('should delete a technician from DynamoDB and return a success response', async () => {

      /* ---------------- CREATE A NEW TECHNICIAN AND GET THE technicianID --------------- */

      event = {
          body: JSON.stringify({
              "documentID": "100200300",
              "name": "Felipe",
              "lastname": "Marin",
              "sector": "Cambio de Piezas",
              "birthday": "11/08/2000",
              "address": "Calle 30 #20 - 12",
              "email": "pimar@gmail.com",
              "phone": "+573123458909"
          }),
      };

      let result = await appCreate.lambdaHandler(event, context)

      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(200);
      expect(result.body).to.be.an('string');

      let response = JSON.parse(result.body);

      expect(response).to.be.an('object');
      expect(response.ok).to.be.equal(true);

      let technicianIDCreated = response.item.technicianID;

      /* --------------------------- TEST DELETE TECHNICIAN -------------------------- */

      event = {
          queryStringParameters: {
              "technicianID": technicianIDCreated
          }
      };

      result = await appDelete.lambdaHandler(event, context)

      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(200);
      expect(result.body).to.be.an('string');

      response = JSON.parse(result.body);

      expect(response).to.be.an('object');
      expect(response.ok).to.be.equal(true);
      expect(response.message).to.be.equal('El técnico se ha eliminado correctamente');
  });
});


describe('Test - Get technicians', function () {
  it('should query all technicians saved in DynamoDB and return a success response', async () => {
      const result = await appGet.lambdaHandler(event, context)

      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(200);
      expect(result.body).to.be.an('string');

      let response = JSON.parse(result.body);
      
      expect(response).to.be.an('array');
  });
});


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

      let result = await appCreate.lambdaHandler(event, context)

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

      result = await appUpdate.lambdaHandler(event, context)
      
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