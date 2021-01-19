/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/kubernetesDaemonSet/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesDaemonSet/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesDaemonSet,
  pluginName: {
    singular: 'Kubernetes DaemonSet',
    plural: 'Kubernetes DaemonSets'
  },
  kpiDefinitions,
  metricDefinitions
});
