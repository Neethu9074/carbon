/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudPostgreSql/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudPostgreSql/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudPostgreSql,

  technologyDescriptor: {
    label: 'IBM Cloud Databases for PostgreSQL'
  },
  kpiDefinitions,
  metricDefinitions
});
