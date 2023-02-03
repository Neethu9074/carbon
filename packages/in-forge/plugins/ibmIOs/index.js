/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/ibmIOs/agentMonitoringIssueDefinitions.js';
import metricDefinitions from 'in-forge/plugins/ibmIOs/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmIOs/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmIOs,

  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.ibmIOs.name')
  }
});
