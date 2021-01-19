/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/awsEc/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsEc/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEc,
  pluginName: {
    singular: 'AWS EC',
    plural: 'AWS ECs'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'AWS EC'
  },
  getLabel(snapshot) {
    const clusterId = snapshot.getIn(['data', 'cache_cluster_id'], '');
    const engine = snapshot.getIn(['data', 'cache_engine'], '');

    return clusterId + ' (' + engine + ')';
  }
});
