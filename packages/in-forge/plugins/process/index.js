/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Map } from 'immutable';

import agentMonitoringIssueDefinitions from 'in-forge/plugins/process/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/process/metricDefinitions';
import tableDefinition from 'in-forge/plugins/process/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/process/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.process,
  pluginName: {
    singular: 'Process',
    plural: 'Processes'
  },
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  tableDefinition,

  getContext(snapshot) {
    return Map({
      Environment: snapshot.getIn(['data', 'env'])
    });
  }
});
