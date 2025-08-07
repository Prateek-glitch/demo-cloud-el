// createNote.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'NoteNestNotes';

exports.handler = async (event) => {
  console.log("Received event:", event);

  // CORS Preflight Handling
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': event.headers.origin || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: ''
    };
  }

  try {
    const note = JSON.parse(event.body);
    const noteId = uuidv4();

    const item = {
      noteId,
      ...note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dynamo.put({
      TableName: TABLE_NAME,
      Item: item
    }).promise();

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': event.headers.origin || '*',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Note created', noteId })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': event.headers.origin || '*',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
