/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/finagleApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/finagleApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.finagleApplicationContainer,

  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
