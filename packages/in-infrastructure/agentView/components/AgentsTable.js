/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ReportingIndicator from 'in-infrastructure/agentView/components/ReportingIndicator';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment, timeConfig$ } from 'in-stores/time/config';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import { reportingStatus as ReportingStatus } from './ReportingStatus';
import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import { modes, logLevels } from 'in-forge/plugins/instanaAgent/modes';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { compareIgnoreCase } from 'in-services/util/string';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { compare } from 'in-services/util/number';
import { getSnapshot } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './AgentsTable.mless';

const cols = [
  {
    title: t('in-infrastructure:agentView.fqdn'),
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        const hostSnapshot$ = getHostSnapshotId(row.snapshot).flatMap(hostId => {
          const to = row.snapshot.get('to') || Date.now();
          const reportingWindowSize = to - row.snapshot.get('from');
          const reportingCenterTime = row.snapshot.get('from') + reportingWindowSize / 2;
          return getSnapshot(hostId, getTimeConfigAtMoment(reportingCenterTime));
        });
        return hostSnapshot$.startWith(null).flatMap(hostSnapshot =>
          getDashboardLink(row.key).map(href => {
            const label = hostSnapshot ? getLabel(hostSnapshot) : getLabel(row.snapshot);
            return {
              value: label,
              content: (
                <Link href={href} className={locals.link}>
                  {hostSnapshot && (
                    <HealthyPluginIcon
                      className={locals.icon}
                      plugin={plugins.instanaAgent}
                      snapshotId={hostSnapshot.get('id')}
                    />
                  )}
                  {label}
                </Link>
              )
            };
          })
        );
      }
    }
  },
  {
    title: t('in-infrastructure:agentView.agentVersion'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'agentVersion']);
      }
    }
  },
  {
    title: t('in-infrastructure:agentView.bootVersion'),
    type: 'string',
    width: 100,
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'boot']);
      }
    }
  },
  {
    title: t('in-infrastructure:agentView.origin'),
    type: 'string',
    width: 125,
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'origin']);
      }
    }
  },
  {
    title: t('in-infrastructure:agentView.updateMode'),
    type: 'string',
    width: 100,
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'updateMode']);
      }
    }
  },
  {
    title: t('in-infrastructure:agentView.mode'),
    type: 'string',
    width: 130,
    typeArgs: {
      getValue(row) {
        return modes[row.snapshot.getIn(['data', 'mode'])];
      }
    }
  },
  {
    title: t('in-infrastructure:agentView.logLevel'),
    type: 'string',
    width: 80,
    typeArgs: {
      getValue(row) {
        return logLevels[row.snapshot.getIn(['data', 'loglevel'])];
      }
    }
  },
  {
    title: t('in-infrastructure:agentView.javaRuntime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return `${row.snapshot.getIn(['data', 'java', 'vmvendor'])} ${row.snapshot.getIn(['data', 'java', 'version'])}`;
      }
    }
  },
  {
    title: t('in-infrastructure:agentView.status'),
    type: 'custom',
    width: 120,
    typeArgs: {
      comparator: (a, b) => {
        // Compare first on high-level status OFFLINE | DEGRADED | ONLINE, then for DEGRADED compare on issue count.
        if (a.status === ReportingStatus.DEGRADED && b.status === ReportingStatus.DEGRADED) {
          return compare(a.totalIssueCount, b.totalIssueCount);
        } else {
          return compare(a.status.value, b.status.value);
        }
      },
      get(row) {
        return {
          value: { status: row.reportingStatus, totalIssueCount: row.totalIssueCount },
          content: <ReportingIndicator row={row} />
        };
      }
    }
  }
];

export default connectTo(
  {
    timeConfig: timeConfig$,
    isInternalVisible: isInternalVisible$
  },
  function AgentViewAgentsTable({ agentSnapshots, timeConfig, isInternalVisible }) {
    const showDetailedAgentStatus = agentMonitoringIssuesEnabled || isInternalVisible;

    const rows = [];
    agentSnapshots?.get('online', emptyList).forEach(snapshot => {
      const count = snapshot.get('monitoringIssuesTotalCount');
      rows.push({
        key: snapshot.get('id'),
        snapshot: snapshot,
        timeConfig,
        totalIssueCount: count,
        reportingStatus:
          showDetailedAgentStatus && count && count > 0 ? ReportingStatus.DEGRADED : ReportingStatus.ONLINE
      });
    });
    agentSnapshots?.get('offline', emptyList).forEach(snapshot => {
      rows.push({
        key: snapshot.get('id'),
        snapshot: snapshot,
        timeConfig,
        reportingStatus: ReportingStatus.OFFLINE
      });
    });

    return (
      <Table
        cardTitle={t('in-infrastructure:agentView.agentDetails')}
        maxItemsPerPage={16}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
      />
    );
  }
);
