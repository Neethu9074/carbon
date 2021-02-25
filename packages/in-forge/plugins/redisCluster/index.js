/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/redisCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/redisCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.redisCluster,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Redis'
  }
});
