const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body);

    if (!requestBody.technicianID) {
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
      Key: { technicianID: requestBody.technicianID },
      UpdateExpression: 'SET documentID = :documentID, name = :name, lastname = :lastname, sector = :sector, birthday = :birthday, address = :address, email = :email, phone = :phone',
      ExpressionAttributeValues: {
        ':documentID': requestBody.documentID,
        ':name': requestBody.name,
        ':lastname': requestBody.lastname,
        ':sector': requestBody.sector,
        ':birthday': requestBody.birthday,
        ':address': requestBody.address,
        ':email': requestBody.email,
        ':phone': requestBody.phone,
      },
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ok: true,
        message: 'El técnico se ha actualizado correctamente',
        updatedTechnician: result.Attributes,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ok: false,
        message: 'Ha ocurrido un error actualizando el técnico',
        content: error.message,
      }),
    };
  }
};
