/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/kubernetesNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesNode/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesNode,

  kpiDefinitions,
  metricDefinitions
});
