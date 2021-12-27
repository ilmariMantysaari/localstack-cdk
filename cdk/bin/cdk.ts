#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AppStack } from "../lib/app-stack";

const app = new cdk.App();
const environment = app.node.tryGetContext("environment");
new AppStack(app, "AppStack", { environment });
