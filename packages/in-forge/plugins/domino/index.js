/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/domino/agentMonitoringIssueDefinitions.js';
import { SPECS } from 'in-forge/plugins/domino/Dashboard/DominoCustomMetrics';
import metricDefinitions from 'in-forge/plugins/domino//metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/domino/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  agentMonitoringIssueDefinitions,
  plugin: plugins.domino,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.domino.domino')
  },
  customMetricsSpecs: SPECS
});
