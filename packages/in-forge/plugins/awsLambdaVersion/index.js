/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/awsLambdaVersion/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsLambdaVersion/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsLambdaVersion,
  kpiDefinitions,
  metricDefinitions,
  supportsInfrastructureTabSubscript: true
});
