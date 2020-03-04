import React from 'react';

import ReportingIndicator from 'in-views/agentView/components/ReportingIndicator';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment, timeConfig$ } from 'in-stores/time/config';
import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import { modes, logLevels } from 'in-forge/plugins/instanaAgent/modes';
import { compare as compareBoolean } from 'in-services/util/boolean';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { compareIgnoreCase } from 'in-services/util/string';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './AgentsTable.mless';

const cols = [
  {
    title: 'FQDN',
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
                      size="xxs"
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
    title: 'Agent Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'agentVersion']);
      }
    }
  },
  {
    title: 'Boot Version',
    type: 'string',
    width: 100,
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'boot']);
      }
    }
  },
  {
    title: 'Origin',
    type: 'string',
    width: 125,
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'origin']);
      }
    }
  },
  {
    title: 'Update Mode',
    type: 'string',
    width: 100,
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'updateMode']);
      }
    }
  },
  {
    title: 'Mode',
    type: 'string',
    width: 130,
    typeArgs: {
      getValue(row) {
        return modes[row.snapshot.getIn(['data', 'mode'])];
      }
    }
  },
  {
    title: 'Log Level',
    type: 'string',
    width: 80,
    typeArgs: {
      getValue(row) {
        return logLevels[row.snapshot.getIn(['data', 'loglevel'])];
      }
    }
  },
  {
    title: 'Java Runtime',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return `${row.snapshot.getIn(['data', 'java', 'vmvendor'])} ${row.snapshot.getIn(['data', 'java', 'version'])}`;
      }
    }
  },
  {
    title: 'Status',
    type: 'custom',
    width: 120,
    typeArgs: {
      comparator: compareBoolean,
      get(row) {
        return {
          value: row.isReportingAtFocusedMoment,
          content: <ReportingIndicator row={row} />
        };
      }
    }
  }
];

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function AgentViewAgentsTable({ agentSnapshots, timeConfig }) {
    const rows = [];
    agentSnapshots.get('online', emptyList).forEach(snapshot => {
      rows.push({
        key: snapshot.get('id'),
        snapshot: snapshot,
        timeConfig,
        isReportingAtFocusedMoment: true
      });
    });
    agentSnapshots.get('offline', emptyList).forEach(snapshot => {
      rows.push({
        key: snapshot.get('id'),
        snapshot: snapshot,
        timeConfig,
        isReportingAtFocusedMoment: false
      });
    });

    return <Table cardTitle="Agent Details" maxItemsPerPage={16} cols={cols} rows={rows} initialSortColumn={0} />;
  }
);
