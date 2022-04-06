# CDK with localstack

Simple demo of localstack + cdk.

This creates an API gateway with one path, `/payload`, that has a POST handler for inputting data into a dynamodb table, and GET handler for getting all rows from the dynamodb table.
See the lambdas in `src/index.ts`, and the resources in `cdk/lib/app-stack.ts`.

When used with cdklocal, all the resources run on your own machine, with no AWS account needed. The same cdk file can be used to deploy this stuff to real AWS as well.

For lambda logs

- Use awslogs https://github.com/jorgebastida/awslogs
- To work with localstack
  - `awslogs groups --aws-endpoint-url http://localhost:4566 --aws-access-key-id foo --aws-secret-access-key bar`
  - Note that the dummy credentials need to be provided, credentials don't need to be real
- Get groups
  - `awslogs groups --aws-endpoint-url http://localhost:4566 --aws-access-key-id foo --aws-secret-access-key bar`
- Get logs from last 10min
  - `awslogs get --aws-endpoint-url http://localhost:4566 --aws-access-key-id foo --aws-secret-access-key bar -s 10m <group-name>`

Dynamo UI

- https://www.npmjs.com/package/dynamodb-admin
- DYNAMO_ENDPOINT=http://localhost:4566 dynamodb-admin
- opens in http://localhost:8001

# How

Install

- [localstack](https://github.com/localstack/localstack), you can run it easily with docker-compose
- [cdklocal](https://github.com/localstack/aws-cdk-local), localstack wrapper for cdk
- [awslocal](https://github.com/localstack/awscli-local), localstack wrapper for aws-cli

Then run these

```sh
npm i
tsc
cd cdk
cdklocal bootstrap # only need to this on first deploy
cdklocal deploy -c environment=local
```

CDK deploy outputs the api url as `AppStack.LocalstackAPIUrl`.
In that url you'll find a GET endpoint for reading stuff from the local dynamodb table, and POST endpoint for inputting stuff into the table

# Things to note

- cdk destroy on this doesn't work very well, apparently the apigateway deletion doesn't work for some reason. To redeploy this after cdk destroy I had to run `docker-compose down` on localstack to completely destroy all resources before redeploying the app
- This was pretty annoying to set up. I probably won't be using localstack for any of my aws development, but it was nice to try it regardless
