/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/awsEs/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsEs/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEs,

  kpiDefinitions,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'es_domain_name'], '');
  },
  technologyDescriptor: {
    label: 'AWS Elasticsearch'
  }
});
