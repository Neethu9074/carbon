/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/rubyRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/rubyRuntimePlatform/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/ruby';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.rubyRuntimePlatform,

  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'Ruby'
  }
});
