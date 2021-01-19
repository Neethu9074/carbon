/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/kubernetesDaemonSet/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesDaemonSet/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesCronJob,
  pluginName: {
    singular: 'Kubernetes CronJob',
    plural: 'Kubernetes CronJobs'
  },
  kpiDefinitions,
  metricDefinitions
});
