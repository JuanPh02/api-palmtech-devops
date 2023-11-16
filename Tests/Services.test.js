'use strict';

const appCreate = require('../Services/create_service/app.js');
const appDelete = require('../Services/delete_service/app.js');
const appGet = require('../Services/get_services/app.js');
const appUpdate = require('../Services/update_service/app.js');
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

      const result = await appCreate.lambdaHandler(event, context)
      
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

      let result = await appCreate.lambdaHandler(event, context)

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

      result = await appDelete.lambdaHandler(event, context)

      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(200);
      expect(result.body).to.be.an('string');

      response = JSON.parse(result.body);

      expect(response).to.be.an('object');
      expect(response.ok).to.be.equal(true);
      expect(response.message).to.be.equal('El servicio se ha eliminado correctamente');
  });
});


// describe('Test - Get services', function () {
//   it('should query all services saved in DynamoDB and return a success response', async () => {
//       const result = await appGet.lambdaHandler(event, context)

//       expect(result).to.be.an('object');
//       expect(result.statusCode).to.equal(200);
//       expect(result.body).to.be.an('string');

//       let response = JSON.parse(result.body);
      
//       expect(response).to.be.an('array');
//   });
// });


describe('Test - Update a service', function () {
  it('should update a service from DynamoDB and return a success response', async () => {

      /* ---------------- CREATE A NEW SERVICE AND GET THE serviceID --------------- */

      event = {
          body: JSON.stringify({
              "category": "MicroElectrónica",
              "brand": "Samsung",
              "model": "Galaxy A53",
              "imei": 894023479340358,
              "damage": "Cambio de IC de Carga",
              "description": "IC de carga dañado",
              "price": 150000,
              "customerName": "Pepito Perez",
              "customerPhoneNumber": "+573103456789",
              "customerEmail": "pepitope@gmail.com"
          }),
      };

      let result = await appCreate.lambdaHandler(event, context)

      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(200);
      expect(result.body).to.be.an('string');

      let response = JSON.parse(result.body);

      expect(response).to.be.an('object');
      expect(response.ok).to.be.equal(true);

      let serviceCreated = response.item;

      /* --------------------------- TEST UPDATE SERVICE -------------------------- */

      event = {
          body: JSON.stringify({
              "serviceID": serviceCreated.serviceID,
              "category": serviceCreated.category,
              "brand": serviceCreated.brand,
              "model": "Galaxy A71",
              "imei": serviceCreated.imei,
              "damage": "Cambio de Logica de Carga",
              "description": "Logica de carga en corto",
              "price": serviceCreated.price,
              "customerName": serviceCreated.customerName,
              "customerPhoneNumber": serviceCreated.customerPhoneNumber,
              "customerEmail": serviceCreated.customerEmail,
          }),
      };

      result = await appUpdate.lambdaHandler(event, context)

      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(200);
      expect(result.body).to.be.an('string');

      response = JSON.parse(result.body);

      expect(response).to.be.an('object');
      expect(response.ok).to.be.equal(true);
      expect(response.message).to.be.equal('El servicio se ha actualizado correctamente');
      expect(response.updatedService.model).to.be.equal('Galaxy A71');
      expect(response.updatedService.damage).to.be.equal('Cambio de Logica de Carga');
      expect(response.updatedService.description).to.be.equal('Logica de carga en corto');
  });
});