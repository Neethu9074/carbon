/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/iBMCloudLoadBalancer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/iBMCloudLoadBalancer/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMCloudLoadBalancer,

  technologyDescriptor: {
    label: 'IBM Cloud Load Balancer'
  },
  kpiDefinitions,
  metricDefinitions,

});
