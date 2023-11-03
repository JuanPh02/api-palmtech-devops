const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body);

    if (!requestBody.serviceID) {
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
          message: 'El campo serviceID es obligatorio en la solicitud',
        }),
      };
    }

    const params = {
      TableName: 'Services',
      Key: { serviceID: requestBody.serviceID},
      UpdateExpression: 'SET category = :category, brand = :brand, model = :model, imei = :imei, damage = :damage, description = :description, price = :price, customerName = :customerName, customerPhoneNumber = :customerPhoneNumber, customerEmail = :customerEmail',
      ExpressionAttributeValues: {
        ':category': requestBody.category,
        ':brand': requestBody.brand,
        ':model': requestBody.model,
        ':imei': requestBody.imei,
        ':damage': requestBody.damage,
        ':description': requestBody.description,
        ':price': requestBody.price,
        ':customerName': requestBody.customerName,
        ':customerPhoneNumber': requestBody.customerPhoneNumber,
        ':customerEmail': requestBody.customerEmail,
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
        message: 'El servicio se ha actualizado correctamente',
        updatedService: result.Attributes,
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
        message: 'Ha ocurrido un error actualizando el servicio',
        content: error.message,
      }),
    };
  }
};
