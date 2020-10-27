import { combineLatest } from 'reactive-observables';
import { Switch, Route } from 'react-router-dom';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer/MaxWidthFullscreenContainer';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import AgentInstallationView from 'in-infrastructure/agentView/components/AgentInstallationView';
import getAgentSnapshotsInTimeframe from 'in-subscription/getAgentSnapshotsInTimeframe';
import { resetAgent, updateAgent } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import AgentsPresenceChart from 'in-infrastructure/agentView/components/AgentsPresenceChart';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import ConfirmationDialog from 'in-new-components/Dialog/ConfirmationDialog';
import AgentViewKpis from 'in-infrastructure/agentView/components/AgentViewKpis';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AgentsTable from 'in-infrastructure/agentView/components/AgentsTable';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { close } from 'in-components/DialogPresenter/store';
import { emptyList } from 'in-services/fixedImmutables';
import { debouncedQuery$ } from 'in-stores/search/query';
import { timeConfig$ } from 'in-stores/time/config';
import Dashboard from 'in-infrastructure/Dashboard';
import SearchBar from 'in-components/SearchBar';
import Footer from 'in-new-components/Footer';
import Button from 'in-new-components/Button';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';

export default connectTo(
  props => {
    const observables = { timeConfig: timeConfig$ };
    if (!props.agentSnapshotsResult) {
      observables.agentSnapshotsResult = combineLatest([timeConfig$, debouncedQuery$]).flatMap(
        ([timeConfig, query]) => {
          return getAgentSnapshotsInTimeframe({ timeConfig, query });
        }
      );
    }
    return observables;
  },
  function AgentView({ agentSnapshotsResult }) {
    if (
      !agentSnapshotsResult ||
      agentSnapshotsResult.getIn(['progress', 'loading']) ||
      agentSnapshotsResult.getIn(['errors']).length > 0
    ) {
      return <LoadingIndicator type="dark" />;
    }
    const agentSnapshots = agentSnapshotsResult.getIn(['data']);
    return (
      <>
        <ViewTrackingMeta
          data={{
            productArea: 'Agents',
            pageRootName: 'Agents'
          }}
        />

        <Switch>
          <Route path={'*/dashboard'} component={Dashboard} />

          <Route
            path="/agents/installation"
            render={() => (
              <MaxWidthFullscreenContainer>
                <AgentInstallationView />
              </MaxWidthFullscreenContainer>
            )}
          />

          <Route
            path="/agents"
            render={() => (
              <Sticky
                header={
                  <>
                    <DashboardHeader
                      title="Agents"
                      contextConfigurations={[{ renderContext: () => 'Agents', contextIcon: 'lib_actions_settings' }]}
                      renderButtonLine={renderButtonLine}
                      agentSnapshots={agentSnapshots}
                    />
                    <DashboardHeaderModule withBottomBorder>
                      <SearchBar style={{ maxWidth: 'calc(100% - 5rem)' }} theme="light" />
                    </DashboardHeaderModule>
                  </>
                }
              >
                <LeftRightPadding>
                  <AgentViewKpis agentSnapshots={agentSnapshots} />
                  <AgentsPresenceChart />
                  <AgentsTable agentSnapshots={agentSnapshots} />
                </LeftRightPadding>
              </Sticky>
            )}
          />
        </Switch>

        <Footer />
      </>
    );
  }
);
function renderButtonLine() {
  return <ButtonLine />;
}

const ButtonLine = connectTo({ isInternalVisible: isInternalVisible$ }, function ButtonLine({
  isInternalVisible,
  agentSnapshots
}) {
  if (!isInternalVisible && !role.canConfigureAgents) {
    return null;
  }

  return (
    <div>
      {isInternalVisible && (
        <>
          <Button kind="primary" onClick={() => updateAllAgents({ agentSnapshots })}>
            Update All Agents
          </Button>
          <Button kind="secondary" onClick={() => resetAllAgents({ agentSnapshots })}>
            Reset All Agents
          </Button>
        </>
      )}
      {role.canConfigureAgents && (
        <Button
          kind="primary"
          href$={getModifiedUrlStream(params => {
            params.pathname = '/agents/installation';
          })}
        >
          Installing Instana Agents
        </Button>
      )}
    </div>
  );
});

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
  addActiveDialog(
    <ConfirmationDialog
      header="Confirm update of all agents"
      description={
        <span>
          Are you sure you want to <strong>update all reporting agents</strong>? This will take{' '}
          {agentSnapshots.get('online', emptyList).count() / 6} minutes.
        </span>
      }
      confirmButtonLabel="Update"
      onSubmit={() => {
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
  addActiveDialog(
    <ConfirmationDialog
      header="Confirm reset of all agents"
      description={
        <span>
          Are you sure you want to <strong>reset all reporting agents</strong>? This will take{' '}
          {agentSnapshots.get('online', emptyList).count()} minutes.
        </span>
      }
      confirmButtonLabel="Reset"
      onSubmit={() => {
        onResetAllAgents({ agentSnapshots });
      }}
    />
  );
}
