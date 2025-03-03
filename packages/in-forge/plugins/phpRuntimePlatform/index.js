/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/phpRuntimePlatform/agentMonitoringIssueDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.phpRuntimePlatform,

  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.phpRuntimePlatform.php')
  }
});
