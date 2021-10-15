import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const docClient = new DynamoDB.DocumentClient({
  // Localstack runs this inside a docker container, this is to access host machine's localhost
  // If you use 'localhost', it will try to connect to localhost inside the lambda container, and will not find dynamodb
  endpoint: "host.docker.internal:4566",
});

// Write stuff to dynamo db, pk with ISO timestamp
export const writeHandler = async (
  event: APIGatewayEvent,
  ctx: Context
): Promise<APIGatewayProxyResult> => {
  const payload = event.body;
  await docClient
    .put({
      TableName: process.env.TABLE_NAME!,
      Item: { PK: new Date().toISOString(), payload },
    })
    .promise();
  return {
    statusCode: 200,
    body: "OK",
  };
};

// Scan the whole table and rteturn everything
export const readHandler = async (event: APIGatewayEvent) => {
  const scanRes = await docClient
    .scan({
      TableName: process.env.TABLE_NAME!,
    })
    .promise();

  console.log("scanRes", scanRes);

  return {
    statusCode: 200,
    body: JSON.stringify(scanRes.Items),
  };
};
