/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/aliCloudOssBucket/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/aliCloudOssBucket/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.aliCloudOssBucket,
  kpiDefinitions,
  metricDefinitions
});
