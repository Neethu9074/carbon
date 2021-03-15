/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/apmProxy/agentMonitoringIssueDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.apmProxy,

  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.apmProxy.apmProxy')
  }
});
