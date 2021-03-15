/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/openshiftDeploymentConfig/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/openshiftDeploymentConfig/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.openshiftDeploymentConfig,

  kpiDefinitions,
  metricDefinitions
});
