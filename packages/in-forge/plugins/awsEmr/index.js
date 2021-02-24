/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/awsEmr/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsEmr/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEmr,

  kpiDefinitions,
  metricDefinitions
});
