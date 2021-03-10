/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/ibmcloudEtcd/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmcloudEtcd/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmcloudEtcd,

  technologyDescriptor: {
    label: 'IBM Cloud Etcd'
  },
  kpiDefinitions,
  metricDefinitions,

});