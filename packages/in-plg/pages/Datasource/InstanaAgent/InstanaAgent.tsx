/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button, Column, Grid, Stack } from '@instana/carbon';
import { useObservable } from '@instana/hooks';

// @ts-expect-error typescript migration needed
import AgentsPresenceChart from 'in-infrastructure/agentView/components/AgentsPresenceChart';
import {
  AGENTS_RESET_ALL_AGENTS_INTERNAL_CLICKED,
  AGENTS_UPDATE_ALL_AGENTS_INTERNAL_CLICKED
} from 'in-services/tracking/eventNames';
// eslint-disable-next-line no-restricted-imports
import { resetAgent, updateAgent } from 'in-forge/plugins/instanaAgent/selfMonitoring';
// @ts-expect-error typescript migration needed
import AgentsTable from 'in-infrastructure/agentView/components/AgentsTable';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import AgentBasedIntegrationView from 'in-infrastructure/agentView/components/AgentBasedIntegrationView';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import NoDataEmptyState from 'in-plg/components/NoDataEmptyState/NoDataEmptyState';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { infraEventCTAClicked } from 'in-infrastructure/tracking/tracking';
import AgentViewKpis from 'in-plg/components/AgentViewKpis/AgentViewKpis';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { datasourceInstanaAgentCatalog } from 'in-plg/navigation/paths';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyList } from 'in-services/fixedImmutables';
import SearchBar from 'in-components/SearchBar';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

interface InstanaAgentProps {
  agentSnapshotsResult: SnapshotData;
}

const InstanaAgent = ({ agentSnapshotsResult }: InstanaAgentProps) => {
  const { goToPath } = useNavigation();
  const loading = agentSnapshotsResult?.getIn(['progress', 'loading'], emptyList) ?? true;
  const onlineAgents = agentSnapshotsResult?.getIn(['data', 'online'], emptyList) ?? emptyList;
  const offlineAgents = agentSnapshotsResult?.getIn(['data', 'offline'], emptyList) ?? emptyList;
  const agentCount = onlineAgents.size + offlineAgents.size || 0;

  if (loading) return <LoadingIndicator />;

  if (agentCount < 1)
    return (
      <NoDataEmptyState
        title={t('in-plg:datasources.noData.instanaAgent.emptyState_title')}
        subtitle={t('in-plg:datasources.noData.instanaAgent.emptyState_subtitle')}
        illustrationPosition="top"
        link={{
          text: t('in-plg:datasources.noData.instanaAgent.emptyState_linktext'),
          href: 'https://www.ibm.com/docs/en/instana-observability/current?topic=installing-instana-agents'
        }}
        action={{
          kind: 'primary',
          text: t('in-plg:datasources.noData.instanaAgent.emptyState_buttontext'),
          onClick: () => {
            goToPath(datasourceInstanaAgentCatalog);
          }
        }}
      />
    );

  return (
    <Stack gap="1rem">
      <section aria-label={t('in-plg:datasources.content')}>
        <LeftRightPadding>
          <SearchBar style={{ maxWidth: '100%' }} theme="light" />
          <RenderButtonLine agentSnapshots={agentSnapshotsResult} />
        </LeftRightPadding>
        <Grid fullWidth narrow>
          <Column sm={16} md={8} lg={4}>
            <AgentViewKpis
              heading={t('in-plg:agentViewKpis.instanaAgents')}
              subHeading={t('in-plg:agentViewKpis.totalReportingAgents')}
              agentSnapshotsResult={agentSnapshotsResult}
            />
          </Column>
          <Column sm={16} md={8} lg={12}>
            <AgentsPresenceChart />
          </Column>
          <Column sm={16} md={16} lg={16}>
            <AgentsTable agentSnapshotsResult={agentSnapshotsResult} />
          </Column>
        </Grid>
      </section>
    </Stack>
  );
};

export default InstanaAgent;

interface SnapshotDataProp {
  agentSnapshots: SnapshotData;
}

function RenderButtonLine({ agentSnapshots }: SnapshotDataProp) {
  return <ButtonLine agentSnapshots={agentSnapshots} />;
}

function onInstallingAgentBasedintergrationsClick() {
  addActiveDialog(<AgentBasedIntegrationView />);
}

function ButtonLine({ agentSnapshots }: SnapshotDataProp) {
  const { createHrefToPath } = useNavigation();
  const isInternalVisible = useObservable(isInternalVisible$, [isInternalVisible$]);

  if (!isInternalVisible && !role?.canConfigureAgents) {
    return null;
  }

  return (
    <div>
      {isInternalVisible && (
        <>
          {role?.canConfigureAgents && (
            <>
              <Button
                kind="ghost"
                renderIcon={() => <IconForButton icon="lib_openclose_add_circle_outline" iconSize="xs" />}
                href={createHrefToPath(datasourceInstanaAgentCatalog)}
              >
                {t('in-infrastructure:agentView.installAgents')}
              </Button>

              <Button
                kind="ghost"
                renderIcon={() => <IconForButton icon="lib_openclose_add_circle_outline" iconSize="xs" />}
                onClick={onInstallingAgentBasedintergrationsClick}
              >
                {t('in-infrastructure:agentView.installAgentBasedIntegrations')}
              </Button>
            </>
          )}
          <Button
            kind="ghost"
            renderIcon={() => <IconForButton icon="lib_actions_cached" iconSize="xs" />}
            onClick={() => {
              infraEventCTAClicked({ event: AGENTS_UPDATE_ALL_AGENTS_INTERNAL_CLICKED });
              updateAllAgents({ agentSnapshots });
            }}
          >
            {t('in-infrastructure:agentView.updateAllAgents')}
          </Button>
          <Button
            kind="ghost"
            renderIcon={() => <IconForButton icon="lib_actions_revert" iconSize="xs" />}
            onClick={() => {
              infraEventCTAClicked({ event: AGENTS_RESET_ALL_AGENTS_INTERNAL_CLICKED });
              resetAllAgents({ agentSnapshots });
            }}
          >
            {t('in-infrastructure:agentView.resetAllAgents')}
          </Button>
        </>
      )}
    </div>
  );
}

function onUpdateAllAgents({ agentSnapshots }: SnapshotDataProp) {
  const sleep = 10000;
  const count = agentSnapshots
    ?.get('online', emptyList)
    .forEach(({ snapshot, i }: { snapshot: SnapshotData; i: number }) => {
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

function updateAllAgents({ agentSnapshots }: SnapshotDataProp) {
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

function onResetAllAgents({ agentSnapshots }: SnapshotDataProp) {
  const sleep = 60000;
  const count = agentSnapshots
    .get('online', emptyList)
    .forEach(({ snapshot, i }: { snapshot: SnapshotData; i: number }) => {
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

function resetAllAgents({ agentSnapshots }: SnapshotDataProp) {
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
