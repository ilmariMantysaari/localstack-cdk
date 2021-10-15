import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { CfnOutput } from "@aws-cdk/core";

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const payloadTable = new dynamodb.Table(this, "PayloadTable", {
      tableName: "payloadTable",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
    });

    const writeHandler = new lambda.Function(this, "WriteHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("../src"),
      handler: "index.writeHandler",
      timeout: cdk.Duration.seconds(90),
      environment: {
        TABLE_NAME: payloadTable.tableName,
      },
    });
    payloadTable.grantWriteData(writeHandler);

    const readHandler = new lambda.Function(this, "ReadHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("../src"),
      handler: "index.readHandler",
      timeout: cdk.Duration.seconds(90),
      environment: {
        TABLE_NAME: payloadTable.tableName,
      },
    });
    payloadTable.grantReadData(readHandler);

    const api = new apigateway.RestApi(this, "AppApi", {
      restApiName: "AppApi",
    });

    const writeIntegration = new apigateway.LambdaIntegration(writeHandler, {});
    const readIntegration = new apigateway.LambdaIntegration(readHandler, {});

    const payloadPath = api.root.addResource("payload");
    payloadPath.addMethod("POST", writeIntegration);
    payloadPath.addMethod("GET", readIntegration);

    new CfnOutput(this, "Localstack API Url", {
      value: `http://localhost:4566/restapis/${api.restApiId}/prod/_user_request_${payloadPath.path}`,
    });
  }
}
