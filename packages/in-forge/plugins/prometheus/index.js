/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/prometheus/agentMonitoringIssueDefinitions';
import { SPECS } from 'in-forge/plugins/prometheus/Dashboard/PrometheusCustomMetrics';
import metricDefinitions from 'in-forge/plugins/prometheus/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/prometheus/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.prometheus,
  agentMonitoringIssueDefinitions,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: t('in-forge:plugins.prometheus.prometheus')
  },
  customMetricsSpecs: SPECS
});
