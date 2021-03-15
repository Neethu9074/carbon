/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/kubernetesCluster/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/kubernetesCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesCluster,

  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions
});
