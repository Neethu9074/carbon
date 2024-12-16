/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/dropwizardApplicationContainer/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/dropwizardApplicationContainer/metricDefinitions';
import tableDefinition from 'in-forge/plugins/dropwizardApplicationContainer/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/dropwizardApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.dropwizardApplicationContainer,

  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  tableDefinition,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: t('in-forge:plugins.dropwizardApplicationContainer.dropwizard')
  }
});
