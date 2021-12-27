import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import * as AWS from "aws-sdk";

// AWS.config.update({
//   region: "us-east-1",
// });

const docClient = new AWS.DynamoDB.DocumentClient({
  // Localstack runs this inside a docker container, this is to access host machine's localhost
  // If you use 'localhost' instead of host.docker.internal, it will try to connect to localhost inside the lambda container, and will not find dynamodb
  // If this is not defined at all, it will try to access real dynamodb in AWS
  endpoint:
    process.env.environment === "local"
      ? "host.docker.internal:4566"
      : undefined,
});

// Write stuff to dynamodb, pk with ISO timestamp
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

// Scan the whole table and return everything
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
    headers: {
      "content-type": "application/json",
    },
  };
};
