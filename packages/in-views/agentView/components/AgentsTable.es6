import React from 'react';

import { resetAgent, updateAgent } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import ReportingIndicator from 'in-views/agentView/components/ReportingIndicator';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment, timeConfig$ } from 'in-stores/time/config';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import { modes, logLevels } from 'in-forge/plugins/instanaAgent/modes';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { compare as compareBoolean } from 'in-services/util/boolean';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getSnapshotsInTimeframe } from 'in-stores/snapshot';
import { close } from 'in-components/DialogPresenter/store';
import { compareIgnoreCase } from 'in-services/util/string';
import { emptyList } from 'in-services/fixedImmutables';
import { getSnapshot } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Button from 'in-new-components/Button';
import Table from 'in-sdk/components/dashboard/Table';
import Link from 'in-components/Link';

import './AgentsTable.less';

const block = 'in-agent-view-table';

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
                <Link href={href} className={`${block}__link`}>
                  {hostSnapshot && (
                    <HealthyPluginIcon
                      plugin={plugins.instanaAgent}
                      overrideSnapshot
                      snapshot={hostSnapshot}
                      dimension={12}
                      fallbackColor={'#000'}
                      className={`${block}__plugin-icon`}
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
    title: 'Mode',
    type: 'string',
    width: 120,
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
  props => {
    const observables = { timeConfig: timeConfig$ };
    if (!props.agentSnapshots) {
      observables.agentSnapshots = getSnapshotsInTimeframe('entity.selfType:agent');
    }
    return observables;
  },
  function AgentViewAgentsTable({ agentSnapshots, timeConfig }) {
    if (!agentSnapshots) {
      return <LoadingIndicator type="dark" />;
    }

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

    let adminButtonBar;
    if (__DEV__) {
      adminButtonBar = (
        <div className={block}>
          <Button kind="primary" className={`${block}__button`} onClick={() => updateAllAgents({ agentSnapshots })}>
            Update All Agents
          </Button>
          <Button kind="secondary" className={`${block}__button`} onClick={() => resetAllAgents({ agentSnapshots })}>
            Reset All Agents
          </Button>
        </div>
      );
    }

    return (
      <Table
        explanation={adminButtonBar}
        cardTitle="Agent Details"
        maxItemsPerPage={16}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
      />
    );
  }
);

function onUpdateAllAgents({ agentSnapshots }) {
  const sleep = 30000;
  const count = agentSnapshots.get('online', emptyList).forEach((snapshot, i) => {
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Updating agent (%s/%s): %s', i + 1, count, snapshot.get('id'));
      updateAgent(snapshot);
    }, sleep * i);
  });
  setTimeout(() => {
    close();
  }, sleep * count);
}

function updateAllAgents({ agentSnapshots }) {
  setActiveDialog(
    <ConfirmationDialog
      header="Confirm update of all agents"
      description={
        <span>
          Are you sure you want to <strong>update all reporting agents</strong>? This will take{' '}
          {agentSnapshots.get('online', emptyList).count() / 2} minutes.
        </span>
      }
      bButtonLabel="Update"
      onB={() => {
        onUpdateAllAgents({ agentSnapshots });
      }}
    />
  );
}

function onResetAllAgents({ agentSnapshots }) {
  const sleep = 60000;
  const count = agentSnapshots.get('online', emptyList).forEach((snapshot, i) => {
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Resetting agent (%s/%s): %s', i + 1, count, snapshot.get('id'));
      resetAgent(snapshot);
    }, sleep * i);
  });
  setTimeout(() => {
    close();
  }, sleep * count);
}

function resetAllAgents({ agentSnapshots }) {
  setActiveDialog(
    <ConfirmationDialog
      header="Confirm reset of all agents"
      description={
        <span>
          Are you sure you want to <strong>reset all reporting agents</strong>? This will take{' '}
          {agentSnapshots.get('online', emptyList).count()} minutes.
        </span>
      }
      bButtonLabel="Reset"
      onB={() => {
        onResetAllAgents({ agentSnapshots });
      }}
    />
  );
}
