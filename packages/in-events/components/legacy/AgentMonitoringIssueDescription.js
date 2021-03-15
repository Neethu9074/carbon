/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getIssueDefinitionForSnapshotAndCode, * as IssueCategories from 'in-sdk/agentMonitoringIssueDefinition';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import './ProblemDescription.less';

// Style similar to ProblemDescription detail
const block = 'in-event-view-event-problem';

export default connectTo(
  ({ event, timeConfig }) => {
    const entityId = event.get('entityId');
    return {
      snapshot: getSnapshot(entityId, timeConfig).startWith(null)
    };
  },
  function MonitoringIssueDescription({ event, snapshot }) {
    const issueCode = event.getIn(['metadata', 'agent_monitoring_code'], '');
    const issueCategory =
      IssueCategories[event.getIn(['metadata', 'agent_monitoring_category'])] || IssueCategories.UNKNOWN;
    const args = event.get('metadata')?.has('agent_monitoring_arguments')
      ? event.getIn(['metadata', 'agent_monitoring_arguments'])
      : event.getIn(['metadata', 'agent_monitoring_args']);
    const issueArgs = args ? args.toJS() : {};

    const issueDefinition = getIssueDefinitionForSnapshotAndCode(snapshot, issueCode);

    const label = issueDefinition.explanationLinkLabel;
    const href = issueDefinition.getExplanationLinkHref?.(args) ?? issueDefinition.explanationLinkHref;

    return (
      <DescriptionList>
        <DescriptionItem title={t('in-events:titleDetail')}>
          <div className={`${block}__suggestion`}>
            <p>
              <strong>
                {issueCategory.alert_prefix}: {issueCode}
              </strong>
            </p>
            <p>
              <issueDefinition.issueDescription.Component {...issueArgs} />
            </p>
            <p>
              {t('in-events:monitoringIssueForMoreInfo')}
              <Link href={href} external>
                {label}
              </Link>
            </p>
          </div>
        </DescriptionItem>
      </DescriptionList>
    );
  }
);
