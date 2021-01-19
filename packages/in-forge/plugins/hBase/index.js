/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/hBase/metricDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import kpiDefinitions from 'in-forge/plugins/hBase/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.hBase,
  pluginName: {
    singular: 'HBase',
    plural: 'HBase'
  },
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'HBase'
  }
});
