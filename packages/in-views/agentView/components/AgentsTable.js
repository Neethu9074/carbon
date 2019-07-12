import React, { Fragment } from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { resetAgent, updateAgent } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import ReportingIndicator from 'in-views/agentView/components/ReportingIndicator';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
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
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import Button from 'in-new-components/Button';
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
                      dimension={12}
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
    const observables = { timeConfig: timeConfig$, isInternalVisible: isInternalVisible$ };
    if (!props.agentSnapshots) {
      observables.agentSnapshots = getSnapshotsInTimeframe('entity.selfType:agent');
    }
    return observables;
  },
  function AgentViewAgentsTable({ agentSnapshots, timeConfig, isInternalVisible }) {
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

    return (
      <Fragment>
        {isInternalVisible && (
          <DashboardSection title="Administration">
            <Button kind="primary" onClick={() => updateAllAgents({ agentSnapshots })}>
              Update All Agents
            </Button>
            <Button kind="secondary" onClick={() => resetAllAgents({ agentSnapshots })}>
              Reset All Agents
            </Button>
          </DashboardSection>
        )}

        <Table cardTitle="Agent Details" maxItemsPerPage={16} cols={cols} rows={rows} initialSortColumn={0} />
      </Fragment>
    );
  }
);

function onUpdateAllAgents({ agentSnapshots }) {
  const sleep = 10000;
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
          {agentSnapshots.get('online', emptyList).count() / 6} minutes.
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
