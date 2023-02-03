/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import kpiDefinitions from 'in-forge/plugins/webSphereMember/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.webSphereMember,
  kpiDefinitions,
  getIconType: () => 'webSphereCluster'
});
