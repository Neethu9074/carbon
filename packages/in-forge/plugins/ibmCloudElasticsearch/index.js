/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudElasticsearch/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudElasticsearch/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudElasticsearch,

  technologyDescriptor: {
    label: 'IBM Cloud Databases for Elasticsearch'
  },
  kpiDefinitions,
  metricDefinitions
});
