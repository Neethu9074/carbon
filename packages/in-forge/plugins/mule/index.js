/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/mule/metricDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import kpiDefinitions from 'in-forge/plugins/mule/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.mule,

  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
