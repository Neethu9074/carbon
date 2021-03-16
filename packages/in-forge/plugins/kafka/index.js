/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/kafka/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/kafka/metricDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import kpiDefinitions from 'in-forge/plugins/kafka/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kafka,

  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  agentMonitoringIssueDefinitions
});
