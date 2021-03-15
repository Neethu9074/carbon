/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/webLogicApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/webLogicApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.webLogicApplicationContainer,

  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
