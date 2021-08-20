/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/db2ZDatabase/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/db2ZDatabase/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/db2ZDatabase/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.db2ZDatabase,

  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.db2ZDatabase.db2Z')
  }
});
