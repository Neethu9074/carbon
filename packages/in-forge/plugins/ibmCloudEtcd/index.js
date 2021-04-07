/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudEtcd/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudEtcd/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudEtcd,

  technologyDescriptor: {
    label: 'IBM Cloud Databases for etcd'
  },
  kpiDefinitions,
  metricDefinitions
});
