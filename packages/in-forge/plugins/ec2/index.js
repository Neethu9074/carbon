/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/ec2/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ec2/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ec2,
  pluginName: {
    singular: 'EC2 Instance',
    plural: 'EC2 Instances'
  },
  kpiDefinitions,
  metricDefinitions
});
