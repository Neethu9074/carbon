/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/iBMCloudEtcd/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/iBMCloudEtcd/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMCloudEtcd,

  technologyDescriptor: {
    label: 'IBM Cloud Databases for etcd'
  },
  kpiDefinitions,
  metricDefinitions
});
