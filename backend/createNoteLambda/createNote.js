const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'NoteNestNotes';

exports.handler = async (event) => {
  try {
    console.log("Incoming event:", event);

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
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Note created', noteId })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
