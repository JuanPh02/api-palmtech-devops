const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body);

    // Genera un nuevo ID para el técnico
    const technicianID = uuidv4();

    // Construye el objeto Technician
    const newTechnician = {
      technicianID,
      documentID: requestBody.documentID,
      name: requestBody.name,
      lastname: requestBody.lastname,
      sector: requestBody.sector,
      birthday: requestBody.birthday,
      address: requestBody.address,
      email: requestBody.email,
      phone: requestBody.phone
    };

    // Parámetros para la operación PutItem de DynamoDB
    const params = {
      TableName: 'Technicians', // Nombre de la tabla en DynamoDB
      Item: newTechnician
    };

    // Inserta el nuevo técnico en la tabla
    await dynamodb.put(params).promise();

    return {
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
        message: 'El técnico se ha creado correctamente'
      })
    };
  } catch (error) {
    return {
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
        message: 'Ha ocurrido un error creando el técnico',
        content: error.message
      })
    };
  }
};
