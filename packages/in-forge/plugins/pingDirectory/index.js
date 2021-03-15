/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/pingDirectory/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/pingDirectory/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pingDirectory,

  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
