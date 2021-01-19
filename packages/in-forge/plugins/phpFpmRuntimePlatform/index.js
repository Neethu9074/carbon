/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/phpFpmRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/phpFpmRuntimePlatform/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/php';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.phpFpmRuntimePlatform,
  pluginName: {
    singular: 'PHP-FPM Runtime',
    plural: 'PHP-FPM Runtimes'
  },
  kpiDefinitions,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  technologyDescriptor: {
    label: 'PHP-FPM'
  }
});
