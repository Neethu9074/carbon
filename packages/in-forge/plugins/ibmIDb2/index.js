/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/ibmIDb2/agentMonitoringIssueDefinitions.js';
import metricDefinitions from 'in-forge/plugins/ibmIDb2/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from '../../../in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmIDb2,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.ibmIDb2.name')
  }
});
