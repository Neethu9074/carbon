/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

/**
 * A Lambda function is mostly a container for individual versions of that function. The actual meat (metrics, chart and
 * stuff) is in awsLambdaVersion.
 */
registerSnapshotDefinition({
  plugin: plugins.awsLambdaFunction
});
