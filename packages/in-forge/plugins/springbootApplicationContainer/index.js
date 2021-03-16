/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/springbootApplicationContainer/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/springbootApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/springbootApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.springbootApplicationContainer,

  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: t('in-forge:plugins.springbootAppContainer.labelSpringBoot')
  }
});
