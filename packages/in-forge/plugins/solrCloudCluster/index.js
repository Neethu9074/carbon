/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/solrCloudCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/solrCloudCluster/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.solrCloudCluster,

  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
