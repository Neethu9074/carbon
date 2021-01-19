/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/kubernetesNamespace/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesNamespace/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesNamespace,
  pluginName: {
    singular: 'Kubernetes Namespace',
    plural: 'Kubernetes Namespaces'
  },
  kpiDefinitions,
  metricDefinitions
});
