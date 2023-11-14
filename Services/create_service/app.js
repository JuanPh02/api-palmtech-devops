const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body);

    const serviceID = uuidv4();

    const newService = {
      serviceID,
      category: requestBody.category,
      brand: requestBody.brand,
      model: requestBody.model,
      imei: requestBody.imei,
      damage: requestBody.damage,
      description: requestBody.description,
      price: requestBody.price,
      customerName: requestBody.customerName,
      customerPhoneNumber: requestBody.customerPhoneNumber,
      customerEmail: requestBody.customerEmail
    }

    const params = {
      TableName: 'Services',
      Item: newService
    };

    await dynamodb.put(params).promise();

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ok: true,
        item: newService,
        message: 'El servicio se ha creado correctamente',
      }),
    };
    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ok: false,
        message: 'Ha ocurrido un error guardando el servicio',
        error: error.message,
      }),
    };
    return response;
  }
};
