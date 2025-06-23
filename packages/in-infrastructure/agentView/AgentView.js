/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route, Redirect } from 'react-router-dom';
import { fromJS } from 'immutable';
import React from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import {
  AGENTS_RESET_ALL_AGENTS_INTERNAL_CLICKED,
  AGENTS_UPDATE_ALL_AGENTS_INTERNAL_CLICKED
} from 'in-services/tracking/tracking';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import AgentBasedIntegrationView from 'in-infrastructure/agentView/components/AgentBasedIntegrationView';
import AgentsPresenceChart from 'in-infrastructure/agentView/components/AgentsPresenceChart';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import getAgentSnapshotsInTimeframe from 'in-subscription/getAgentSnapshotsInTimeframe';
import { resetAgent, updateAgent } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import AgentInstallationViewV2 from 'in-plg/pages/onboarding/AgentInstallationViewV2';
import AgentViewKpis from 'in-infrastructure/agentView/components/AgentViewKpis';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import AgentsTable from 'in-infrastructure/agentView/components/AgentsTable';
import { infraEventCTAClicked } from 'in-infrastructure/tracking/tracking';
import AgentViewRouterV2 from 'in-plg/pages/onboarding/AgentViewRouterV2';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import AgentViewRouter from 'in-plg/pages/onboarding/AgentViewRouter';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { close } from 'in-components/DialogPresenter/store';
import { pageNames } from 'in-services/tracking/pageNames';
import { debouncedQuery$ } from 'in-stores/search/query';
import getUsageInfo from 'in-subscription/getUsageInfo';
import { emptyList } from 'in-services/fixedImmutables';
import { timeConfig$ } from 'in-stores/time/config';
import Dashboard from 'in-infrastructure/Dashboard';
import SearchBar from 'in-components/SearchBar';
import { getUnitKeys } from 'in-api/unitKeys';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

export default connectTo(
  props => {
    const observables = {
      timeConfig: timeConfig$,
      accountConfig: messages$
    };
    if (!props.agentSnapshotsResult) {
      observables.agentSnapshotsResult = combineLatest([timeConfig$, debouncedQuery$]).flatMap(
        ([timeConfig, query]) => {
          return getAgentSnapshotsInTimeframe({ timeConfig, query }).map(fromJS);
        }
      );
    }
    if (!props.accountConfig) {
      observables.accountConfig = getUsageInfo();
    }
    return observables;
  },
  function AgentView({ agentSnapshotsResult, accountConfig }) {
    const unitKeys = useObservable(getUnitKeys(), []) ?? '{agentKey:AGENT_KEY,downloadKey:DOWNLOAD_KEY}';
    if (!accountConfig) {
      return <LoadingIndicator type="dark" />;
    }

    return (
      <>
        <ViewTrackingMeta
          data={{
            productArea: productAreas.agents,
            pageRootName: pageNames.agents
          }}
        />

        <Switch>
          <Route path={'*/dashboard'} component={Dashboard} />

          <Route
            exact
            path="/agents/installation/:selectedservice"
            render={({ match }) => (
              <AgentViewRouter
                selectedService={match.params.selectedservice}
                agentKey={unitKeys.agentKey}
                downloadKey={unitKeys.downloadKey}
              />
            )}
          />

          <Route
            exact
            path="/datasources/installation/:selectedservice"
            render={({ match }) => (
              <AgentViewRouterV2
                selectedService={match.params.selectedservice}
                agentKey={unitKeys.agentKey}
                downloadKey={unitKeys.downloadKey}
              />
            )}
          />

          <Route path="/agents/installation">
            <AgentInstallationViewV2 />
          </Route>

          <Route path="/datasources/installation">
            <AgentInstallationViewV2 />
          </Route>

          <Route path="/agents/onboarding/installation/:selectedservice" render={() => <Redirect to="/home" />} />

          <Route path="/agents/onboarding/installation" render={() => <Redirect to="/home" />} />

          <Route path="/datasources/onboarding/installation/:selectedservice" render={() => <Redirect to="/home" />} />

          <Route path="/datasources/onboarding/installation" render={() => <Redirect to="/home" />} />

          <Route path="/agents">
            <Sticky
              header={
                <>
                  <DashboardHeader
                    title={t('in-infrastructure:agentView.agents')}
                    contextConfigurations={[
                      {
                        renderContext: () => t('in-infrastructure:agentView.agents'),
                        contextIcon: 'lib_actions_settings'
                      }
                    ]}
                    renderButtonLine={renderButtonLine}
                  />
                  <DashboardHeaderModule withBottomBorder>
                    <SearchBar style={{ maxWidth: 'calc(100% - 5rem)' }} theme="light" />
                  </DashboardHeaderModule>
                </>
              }
            >
              <LeftRightPadding>
                <AgentViewKpis agentSnapshotsResult={agentSnapshotsResult} />
                <AgentsPresenceChart />
                <AgentsTable agentSnapshotsResult={agentSnapshotsResult} />
              </LeftRightPadding>
            </Sticky>
          </Route>
        </Switch>

        <Footer />
      </>
    );
  }
);

function renderButtonLine(props) {
  const { agentSnapshots } = props;
  return <ButtonLine agentSnapshots={agentSnapshots} />;
}
function onInstallingAgentBasedintergrationsClick() {
  addActiveDialog(<AgentBasedIntegrationView />);
}

function ButtonLine({ agentSnapshots }) {
  const { createHrefToPath } = useNavigation();
  const isInternalVisible = useObservable(isInternalVisible$, [isInternalVisible$]);

  if (!isInternalVisible && !role.canConfigureAgents) {
    return null;
  }

  return (
    <div>
      {isInternalVisible && (
        <>
          <Button
            kind="primary"
            onClick={() => {
              infraEventCTAClicked({ event: AGENTS_UPDATE_ALL_AGENTS_INTERNAL_CLICKED });
              updateAllAgents({ agentSnapshots });
            }}
          >
            {t('in-infrastructure:agentView.updateAllAgents')}
          </Button>
          <Button
            kind="secondary"
            onClick={() => {
              infraEventCTAClicked({ event: AGENTS_RESET_ALL_AGENTS_INTERNAL_CLICKED });
              resetAllAgents({ agentSnapshots });
            }}
          >
            {t('in-infrastructure:agentView.resetAllAgents')}
          </Button>
        </>
      )}
      {role.canConfigureAgents && (
        <>
          <Button kind="secondary" href={createHrefToPath('/agents/installation')}>
            {t('in-infrastructure:agentView.installAgents')}
          </Button>

          <Button onClick={onInstallingAgentBasedintergrationsClick} kind="secondary">
            {t('in-infrastructure:agentView.installAgentBasedIntegrations')}
          </Button>
        </>
      )}
    </div>
  );
}

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
      header={t('in-infrastructure:agentView.confirmUpdateOfAllAgents')}
      description={
        <span>
          <Trans
            i18nKey="in-infrastructure:agentView.confirmUpdateDesc"
            values={{ count: agentSnapshots.get('online', emptyList).count() / 6 }}
          />
        </span>
      }
      confirmButtonLabel={t('in-infrastructure:agentView.update')}
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
      header={t('in-infrastructure:agentView.confirmResetOfAllAgents')}
      description={
        <span>
          <Trans
            i18nKey="in-infrastructure:agentView.confirmResetDesc"
            values={{ count: agentSnapshots.get('online', emptyList).count() }}
          />
        </span>
      }
      confirmButtonLabel={t('in-infrastructure:agentView.reset')}
      onSubmit={() => {
        onResetAllAgents({ agentSnapshots });
      }}
    />
  );
}
