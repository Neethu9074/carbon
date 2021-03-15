/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getMonitoringIssuesForAgentSnapshot from 'in-subscription/getMonitoringIssuesForAgentSnapshot';
import getIssueDefinitionForSnapshotAndCode from 'in-sdk/agentMonitoringIssueDefinition';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';
import { formatDateTime } from 'in-services/formatters/date';
import { compareIgnoreCase } from 'in-services/util/string';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import BreakAll from 'in-components/typo/BreakAll';
import SvgIcon from 'in-components/SvgIcon';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './IssueList.mless';

const cols = [
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.on'),
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        return getDashboardLink(row.key).map(href => {
          const label = row.snapshot ? getLabel(row.snapshot) : `Unknown at ${formatDateTime(row.timestamp)}`;
          return {
            value: label,
            content: (
              <div className={locals.wrapper}>
                {row.snapshot && <SvgIcon className={locals.icon} type={getIconType(row.snapshot)} />}
                <Link href={href} className={locals.link}>
                  {label}
                </Link>
              </div>
            )
          };
        });
      }
    }
  },
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.code'),
    type: 'custom', // 'custom' because 'string' sets css 'break-word' which we don't want for the code
    typeArgs: {
      comparator: compareIgnoreCase,
      get(row) {
        return {
          value: row.code,
          content: <span>{row.code}</span>
        };
      }
    }
  },
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.description'),
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get(row) {
        const args = row.arguments ? row.arguments.toJS() : {};
        const issueDefinition = getIssueDefinitionForSnapshotAndCode(row.snapshot, row.code);

        return {
          value: row.code,
          content: (
            <BreakAll>
              <issueDefinition.issueDescription.Component {...args} />
            </BreakAll>
          )
        };
      }
    }
  },
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.moreInfo'),
    type: 'custom',
    width: 150,
    typeArgs: {
      comparator: compareIgnoreCase,
      get(row) {
        const args = row.arguments ? row.arguments.toJS() : {};
        const issueDefinition = getIssueDefinitionForSnapshotAndCode(row.snapshot, row.code);
        const label = issueDefinition.explanationLinkLabel;
        const href = issueDefinition.getExplanationLinkHref?.(args) ?? issueDefinition.explanationLinkHref;
        return {
          value: label,
          content: (
            <Link href={href} className={locals.link} external>
              {label}
            </Link>
          )
        };
      }
    }
  }
];

export default connectTo(
  ({ snapshot, timeConfig }) => {
    const snapshotId = snapshot.get('id');
    return {
      result: getMonitoringIssuesForAgentSnapshot({ timeConfig, snapshotId })
    };
  },
  function IssueList({ result, timeConfig }) {
    if (!result || result.getIn(['progress', 'loading']) || result.getIn(['errors']).length > 0) {
      // Might want to give an error message instead, but for now settle with not showing the list
      return null;
    }

    const rows = [];
    result.get('data', emptyList).forEach(event => {
      rows.push({
        key: event.get('affectedEntityId'),
        snapshot: event.get('affectedEntitySnapshot'),
        code: event.get('agentMonitoringCode'),
        arguments: event.get('agentMonitoringArguments'),
        timestamp: timeConfig.focusedMoment || Date.now()
      });
    });

    return (
      <Table
        cardTitle={t('in-forge:plugins.instanaAgent.dashboard.monitoringIssues')}
        withoutPadding
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="desc"
        noDataText={t('in-forge:plugins.instanaAgent.dashboard.noIssuesFound')}
      />
    );
  }
);
