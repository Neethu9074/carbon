import React, { Fragment } from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import getIssueDefinitionForSnapshotAndCode, * as IssueCategories from 'in-sdk/agentMonitoringIssueDefinition';
import getMonitoringIssuesForSnapshot from 'in-subscription/getMonitoringIssuesForSnapshot';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import { warning } from 'in-new-components/Message/types';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './AgentMonitoringIssueNotifications.mless';

export default connectTo(
  ({ snapshot, timeConfig }) => {
    const snapshotId = snapshot.get('id');
    return {
      isInternalVisible: isInternalVisible$,
      monitoringIssuesResult: getMonitoringIssuesForSnapshot({ timeConfig, snapshotId })
        .filter(issuesResult => issuesResult && issuesResult.get('data'))
        .map(issuesResult => issuesResult.get('data'))
        .startWith(null)
    };
  },
  function AgentMonitoringIssueNotifications({ isInternalVisible, snapshot, timeConfig, monitoringIssuesResult }) {
    // Don't render this component if the Internal view not visible AND feature flag not enabled
    if (!isInternalVisible && !agentMonitoringIssuesEnabled) {
      return null;
    }

    const currentSnapshotPlugin = snapshot.get('plugin');
    const monitoringIssuesList =
      monitoringIssuesResult &&
      monitoringIssuesResult.map(event => {
        const eventPlugin = event.get('affectedEntitySnapshot')?.get('plugin')
          ? event.get('affectedEntitySnapshot')
          : currentSnapshotPlugin;
        return {
          key: event.get('affectedEntityId'),
          snapshot: eventPlugin,
          code: event.get('agentMonitoringCode'),
          category: IssueCategories[event.get('agentMonitoringCategory')] || IssueCategories.UNKNOWN,
          arguments: event.get('agentMonitoringArguments'),
          timestamp: timeConfig.focusedMoment || Date.now()
        };
      });

    return (
      <Fragment>
        {monitoringIssuesList &&
          monitoringIssuesList.map(row => {
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
      </Fragment>
    );
  }
);
