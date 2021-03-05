/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import metricDefinitions from 'in-forge/plugins/kubernetesDeployment/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesDeployment/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesDeployment,

  kpiDefinitions,
  metricDefinitions
});
