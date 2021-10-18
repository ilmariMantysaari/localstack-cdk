# CDK with localstack

Simple demo of localstack + cdk.

This creates an API gateway with one path, `/payload`, that has a POST handler for inputting data into a dynamodb table, and GET handler for getting all rows from the dynamodb table.
See the lambdas in `src/index.ts`, and the resources in `cdk/lib/app-stack.ts`.

When used with cdklocal, all the resources run on your own machine, with no AWS account needed. The same cdk file can be used to deploy this stuff to real AWS as well.

# How

Install

- [localstack](https://github.com/localstack/localstack), you can run it easily with docker-compose
- [cdklocal](https://github.com/localstack/aws-cdk-local), localstack wrapper for cdk
- [awslocal](https://github.com/localstack/awscli-local), aws cli wrapper for cdk

Then run these

```sh
npm i
tsc
cd cdk
cdklocal bootstrap # only need to this on first deploy
cdklocal deploy
```

CDK deploy outputs the api url as `AppStack.LocalstackAPIUrl`.
In that url you'll find a GET endpoint for reading stuff from the local dynamodb table, and POST endpoint for inputting stuff into the table

# Things to note

- cdk destroy on this doesn't work very well, apparently the apigateway deletion doesn't work for some reason. To redeploy this after cdk destroy I had to run `docker-compose down` on localstack to completely destroy all resources before redeploying the app
