import { compose } from 'recompose';
import React from 'react';

import getMonitoringIssuesForAgentSnapshot from 'in-subscription/getMonitoringIssuesForAgentSnapshot';
import getIssueDefinitionForSnapshotAndCode from 'in-sdk/agentMonitoringIssueDefinition';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { formatDateTime } from 'in-services/formatters/date';
import { compareIgnoreCase } from 'in-services/util/string';
import { getLabel, getIconSvgPath } from 'in-sdk/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { getSnapshot } from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './IssueList.mless';

const cols = [
  {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        return getSnapshot(row.key, getTimeConfigAtMoment(row.timestamp))
          .startWith(null)
          .flatMap(snapshot =>
            getDashboardLink(row.key).map(href => {
              const label = snapshot ? getLabel(snapshot) : `Unknown at ${formatDateTime(row.timestamp)}`;
              return {
                value: label,
                content: (
                  <div className={locals.wrapper}>
                    {snapshot && <SvgIcon className={locals.icon} size={'s'} iconPath={getIconSvgPath(snapshot)} />}
                    <Link href={href} className={locals.link}>
                      {label}
                    </Link>
                  </div>
                )
              };
            })
          );
      }
    }
  },
  {
    title: 'Description',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        return getSnapshot(row.key, getTimeConfigAtMoment(row.timestamp))
          .startWith(null)
          .map(snapshot => {
            const issueDefinition = getIssueDefinitionForSnapshotAndCode(snapshot, row.code);

            return {
              value: row.code,
              content: <issueDefinition.issueDescription.Component {...row.arguments} />
            };
          });
      }
    }
  },
  {
    title: 'More info',
    type: 'custom',
    width: 150,
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        return getSnapshot(row.key, getTimeConfigAtMoment(row.timestamp))
          .startWith(null)
          .map(snapshot => {
            const issueDefinition = getIssueDefinitionForSnapshotAndCode(snapshot, row.code);
            const label = issueDefinition.explanationLinkLabel;
            const href = issueDefinition.explanationLinkHref;
            return {
              value: label,
              content: (
                <Link href={href} className={locals.link} external>
                  {label}
                </Link>
              )
            };
          });
      }
    }
  }
];

export default compose(
  cursorPaginated({
    getResettingProps: () => ['snapshot', 'timeConfig'],
    get: ({ snapshot, timeConfig, cursor }) => {
      const snapshotId = snapshot.get('id');
      return getMonitoringIssuesForAgentSnapshot({
        timeConfig,
        snapshotId,
        pagination: {
          cursor,
          retrievalSize: 200 // We don't yet have regular tables that support pagination, so just fetch a big number
        }
      });
    }
  })
)(IssueList);

function IssueList(props) {
  const { items, timeConfig } = props;

  if (!items) {
    // Might want to give an error message instead, but for now settle with not showing the list
    return null;
  }

  const rows = [];
  items.forEach(event => {
    rows.push({
      key: event.entityId,
      code: event.metadata['agent_monitoring_code'],
      arguments: event.metadata['agent_monitoring_arguments'],
      timestamp: timeConfig.focusedMoment || Date.now()
    });
  });

  return (
    <Table
      cardTitle="Issues"
      withoutPadding
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="desc"
    />
  );
}
