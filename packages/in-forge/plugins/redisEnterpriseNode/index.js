/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/redisEnterpriseNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/redisEnterpriseNode/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.redisEnterpriseNode,
  pluginName: {
    singular: 'Redis Enterprise Node',
    plural: 'Redis Enterprise Nodes'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Redis Enterprise'
  }
});
