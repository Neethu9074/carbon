/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import kpiDefinitions from 'in-forge/plugins/liferayApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.liferayApplicationContainer,

  kpiDefinitions,
  getCodeView,
  supportsCodeView
});
