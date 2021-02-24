/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/awsMskCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsMskCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsMskCluster,

  technologyDescriptor: {
    label: 'AWS MSK Cluster'
  },
  kpiDefinitions,
  metricDefinitions
});
