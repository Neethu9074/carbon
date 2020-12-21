import React, { Fragment } from 'react';

import * as IssueCategories from 'in-sdk/agentMonitoringIssueDefinition';
import { reportingStatus as ReportingStatus } from './ReportingStatus';
import classNames from 'classnames';
import { formatDateTime } from 'in-services/formatters/date';
import { getSingular, getPlural } from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';

import './ReportingIndicator.less';

const block = 'in-agent-view-table-reporting-indicator';

export default function ReportingIndicator({ row }) {
  const isReporting = row.reportingStatus;
  const monitoringIssuesCount = row.snapshot.get('monitoringIssuesTotalCount');

  return (
    <Tooltip content={getTooltipText(row)} align={'rightMiddle'}>
      <div
        className={classNames({
          [`${block}`]: true,
          [`${block}__is-reporting`]: isReporting === ReportingStatus.ONLINE,
          [`${block}__is-degraded`]: isReporting === ReportingStatus.DEGRADED
        })}
      >
        <isReporting.Component count={monitoringIssuesCount} />
      </div>
    </Tooltip>
  );
}

function getTooltipText(row) {
  if (row.reportingStatus !== ReportingStatus.DEGRADED) {
    let text =
      row.reportingStatus !== ReportingStatus.OFFLINE
        ? ''
        : 'The agent reported in the selected time range but has not reported at the selected moment. ';

    // When available, take the time the Agent got started. "from" timestamps might be newer for example when a new
    // Snapshot was created during backend update or for other reasons. As users have no concept of these Snapshots,
    // using the "from" time might confuse them.
    const startedAt = row.snapshot.get('data')?.get('startedAt');
    const from = startedAt ? startedAt : row.snapshot.get('from');
    if (!row.snapshot.get('to')) {
      text += `The agent started at ${formatDateTime(from)} and is still reporting.`;
    } else {
      text += `The agent reported between: ${formatDateTime(from)} and ${formatDateTime(row.snapshot.get('to'))}.`;
    }

    return text;
  } else {
    const monitoringIssuesTotalCount = row.snapshot.get('monitoringIssuesTotalCount');
    const monitoringIssuesByCategory = row.snapshot.get('monitoringIssuesCountByCategory');

    const rows = [];
    monitoringIssuesByCategory.forEach((entityList, eventCategory) => {
      const category = IssueCategories[eventCategory] || IssueCategories.UNKNOWN;
      entityList.forEach((issueCount, plugin) => {
        rows.push(
          <Fragment key={plugin}>
            <br />
            <span>
              {issueCount} {issueCount === 1 ? getSingular(plugin) : getPlural(plugin)} {category.suffix}
            </span>
          </Fragment>
        );
      });
    });

    return (
      <div>
        <span>{`${monitoringIssuesTotalCount} Issue${monitoringIssuesTotalCount > 1 ? 's' : ''} reported:`}</span>
        {rows}
      </div>
    );
  }
}
