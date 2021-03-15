/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/hadoopYARN/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/hadoopYARN/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.hadoopYARN,

  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
