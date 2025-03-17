/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/domino/agentMonitoringIssueDefinitions.js';
import { SPECS } from 'in-forge/plugins/domino/Dashboard/DominoCustomMetrics';
import metricDefinitions from 'in-forge/plugins/domino//metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  agentMonitoringIssueDefinitions,
  plugin: plugins.domino,

  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.domino.domino')
  },
  customMetricsSpecs: SPECS
});
