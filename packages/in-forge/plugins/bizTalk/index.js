/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/bizTalk/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/bizTalk/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.bizTalk,
  pluginName: {
    singular: 'BizTalk Host',
    plural: 'BizTalk Hosts'
  },
  kpiDefinitions,
  metricDefinitions
});
