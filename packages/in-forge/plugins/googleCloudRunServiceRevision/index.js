/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/googleCloudRunServiceRevision/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudRunServiceRevision/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudRunServiceRevision,

  metricDefinitions,
  kpiDefinitions,
  technologyDescriptor: {
    label: 'Google Cloud Run'
  }
});
