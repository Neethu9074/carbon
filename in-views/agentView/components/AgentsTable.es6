import React from 'react';

import ReportingIndicator from 'in-views/agentView/components/ReportingIndicator';
import getHostSnapshotId from 'in-services/subscription/getHostSnapshotId';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { compare as compareBoolean } from 'in-services/util/boolean';
import HealthyPluginIcon from 'in-components/HealthyPluginIcon';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getSnapshotsInTimeframe } from 'in-stores/snapshot';
import { modes } from 'in-forge/plugins/instanaAgent/modes';
import { compareIgnoreCase } from 'in-services/util/string';
import { emptyList } from 'in-services/fixedImmutables';
import { getDashboardLink } from 'in-stores/navigation';
import { alwaysNull } from 'in-services/fixedStreams';
import { focusedMoment$ } from 'in-stores/timeline';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';
import Link from 'in-components/Link';

import './AgentsTable.less';

const block = 'in-agent-view-table';

const cols = [
  {
    title: 'Agent',
    type: 'custom',
    typeArgs: {
      comparator: () => compareIgnoreCase,
      get$(row) {
        const hostSnapshot$ = getHostSnapshotId(row.snapshot).flatMap(hostId => {
          const to = row.snapshot.get('to') || Date.now();
          const reportingWindowSize = to - row.snapshot.get('from');
          const reportingCenterTime = row.snapshot.get('from') + reportingWindowSize / 2;
          return hostId ? getSnapshot(hostId, reportingCenterTime) : alwaysNull;
        });
        return hostSnapshot$.flatMap(hostSnapshot =>
          getDashboardLink(row.key).map(href => {
            const label = getLabel(hostSnapshot);
            return {
              value: label,
              content: (
                <Link href={href} className={`${block}__link`}>
                  <HealthyPluginIcon
                    snapshot={hostSnapshot}
                    dimension={12}
                    fallbackColor={'#000'}
                    className={`${block}__plugin-icon`}
                  />
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
    title: 'Boot Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'boot']);
      }
    }
  },
  {
    title: 'Mode',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return modes[row.snapshot.getIn(['data', 'mode'])];
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
  props => {
    const observables = { focusedMoment: focusedMoment$ };
    if (!props.agentSnapshots) {
      observables.agentSnapshots = getSnapshotsInTimeframe('entity.selfType:agent');
    }
    return observables;
  },
  function AgentViewAgentsTable({ agentSnapshots, focusedMoment }) {
    if (!agentSnapshots) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = [];
    agentSnapshots.get('online', emptyList).forEach(snapshot => {
      rows.push({
        key: snapshot.get('id'),
        snapshot: snapshot,
        focusedMoment,
        isReportingAtFocusedMoment: true
      });
    });
    agentSnapshots.get('offline', emptyList).forEach(snapshot => {
      rows.push({
        key: snapshot.get('id'),
        snapshot: snapshot,
        focusedMoment,
        isReportingAtFocusedMoment: false
      });
    });

    return (
      <DashboardTile
        title={`Agents (${agentSnapshots.get('online', emptyList).size} reporting,
          ${agentSnapshots.get('offline', emptyList).size} offline)`}
      >
        <Table maxItemsPerPage={10} cols={cols} rows={rows} initialSortColumn={4} />
      </DashboardTile>
    );
  }
);
