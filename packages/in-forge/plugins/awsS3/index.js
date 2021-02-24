/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/awsS3/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsS3/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsS3,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'AWS S3'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 's3_bucket_name'], '');
  }
});
