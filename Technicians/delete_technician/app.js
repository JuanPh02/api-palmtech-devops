const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event) => {
  try {
    const technicianID = event.queryStringParameters ? event.queryStringParameters.technicianID : null;

    if (!technicianID) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
          'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ok: false,
          message: 'El campo technicianID es obligatorio en la solicitud',
        }),
      };
    }

    const params = {
      TableName: 'Technicians',
      Key: {
        technicianID: technicianID,
      },
    };

    await dynamodb.delete(params).promise();

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,DELETE',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ok: true,
        message: 'El técnico se ha eliminado correctamente',
      }),
    };
    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,DELETE',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ok: false,
        message: 'Ha ocurrido un error eliminando al técnico',
        error: error.message,
      }),
    };
    return response;
  }
};
