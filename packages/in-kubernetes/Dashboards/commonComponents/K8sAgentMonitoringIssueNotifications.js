/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import getIssueDefinitionForSnapshotAndCode, * as IssueCategories from 'in-sdk/agentMonitoringIssueDefinition';
import getKubernetesClusterByRelation from 'in-subscription/kubernetes/getKubernetesClusterByRelation';
import getMonitoringIssuesForSnapshot from 'in-subscription/getMonitoringIssuesForSnapshot';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import { warning } from 'in-new-components/Message/types';
import { getSnapshot } from 'in-stores/snapshot';
import Message from 'in-new-components/Message';

import locals from './K8sAgentMonitoringIssueNotifications.mless';

export default function K8sAgentMonitoringIssueNotificationsNullChecker(props) {
  if (!agentMonitoringIssuesEnabled) {
    return null;
  }
  return <K8sAgentMonitoringIssueNotifications {...props} />;
}

function K8sAgentMonitoringIssueNotifications({ clusterId, data, timeConfig, entityName }) {
  const cluster = useObservable(
    getKubernetesClusterByRelation({
      filter: {
        resourceSnapshotId: data.id,
        timeConfig: timeConfig
      }
    }),
    [data.id, timeConfig]
  );
  const clusterSnapshotId = clusterId || cluster?.data?.id;
  const clusterSnapshot = useObservable(clusterSnapshotId && getSnapshot(clusterSnapshotId, timeConfig), [
    clusterSnapshotId,
    timeConfig
  ]);
  const monitoringIssues = useObservable(
    clusterSnapshotId && getMonitoringIssuesForSnapshot({ timeConfig, snapshotId: clusterSnapshotId }),
    [clusterSnapshotId, timeConfig]
  );

  const k8sMonitoringIssues =
    monitoringIssues &&
    monitoringIssues.get('data') &&
    monitoringIssues
      .get('data')
      .map(issue => {
        const issuePlugin = issue.get('affectedEntitySnapshot')?.get('plugin')
          ? issue.get('affectedEntitySnapshot')
          : clusterSnapshot?.get('plugin');
        return {
          key: issue.get('affectedEntityId'),
          snapshot: issuePlugin,
          code: issue.get('agentMonitoringCode'),
          category: IssueCategories[issue.get('agentMonitoringCategory')] || IssueCategories.UNKNOWN,
          arguments: issue.get('agentMonitoringArguments') || {},
          timestamp: timeConfig.focusedMoment || Date.now()
        };
      })
      .filter(issue => {
        return (
          issue.code === 'kubernetes_missing_permissions' && issue.arguments.get('appliesTo')?.includes(entityName)
        );
      });

  return (
    <>
      {k8sMonitoringIssues &&
        k8sMonitoringIssues.map(row => {
          const args = row.arguments ? row.arguments.toJS() : {};
          const issueDefinition = getIssueDefinitionForSnapshotAndCode(row.snapshot, row.code);
          return (
            <Message withIcon type={warning} className={locals.monitoringMessage} key={row.code}>
              <div className={locals.monitoringIssuesMessageContent}>
                <div>
                  <p className={locals.monitoringIssueMessageText}>
                    <strong>
                      {row.category.alert_prefix}: {row.code}
                    </strong>
                  </p>
                  <p className={locals.monitoringIssueMessageText}>
                    <issueDefinition.issueDescription.Component {...args} />
                  </p>
                </div>
                <Button
                  href={issueDefinition.getExplanationLinkHref?.(args) ?? issueDefinition.explanationLinkHref}
                  size="compact"
                  kind="secondary"
                  target="_blank"
                  className={locals.monitoringIssuesMessageButton}
                >
                  {issueDefinition.explanationLinkLabel}
                </Button>
              </div>
            </Message>
          );
        })}
    </>
  );
}
