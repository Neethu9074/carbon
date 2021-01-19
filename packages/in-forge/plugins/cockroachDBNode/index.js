/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/cockroachDBNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/cockroachDBNode/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.cockroachDBNode,
  pluginName: {
    singular: 'CockroachDB Node',
    plural: 'CockroachDB Nodes'
  },
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
