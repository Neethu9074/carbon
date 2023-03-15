/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/webSphereMember/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/webSphereMember/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.webSphereMember,
  kpiDefinitions,
  metricDefinitions,
  getIconType: () => 'webSphereCluster'
});
