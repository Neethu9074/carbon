/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/traefik/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/traefik/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.traefik,
  agentMonitoringIssueDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.traefik.traefik')
  }
});
