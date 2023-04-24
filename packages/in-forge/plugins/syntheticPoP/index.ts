/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/syntheticPoP/agentMonitoringIssueDefinitions';
// @ts-expect-error
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/syntheticPoP/metricDefinitions';
import tableDefinition from 'in-forge/plugins/syntheticPoP/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/syntheticPoP/kpiDefinitions';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.syntheticPoP,

  kpiDefinitions,
  agentMonitoringIssueDefinitions,
  metricDefinitions,
  tableDefinition,
  technologyDescriptor: {
    label: t('in-forge:plugins.syntheticPoP.syntheticPoP')
  }
});
