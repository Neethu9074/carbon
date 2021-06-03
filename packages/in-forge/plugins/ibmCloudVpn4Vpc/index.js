/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudVpn4Vpc/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudVpn4Vpc/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudVpn4Vpc,

  technologyDescriptor: {
    label: 'IBM Cloud VPN for VPC'
  },
  kpiDefinitions,
  metricDefinitions
});
