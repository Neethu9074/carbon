/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

import { Typography, SearchInput, SvgIcon } from '@instana/components';
import { Stack, Button, Link } from '@instana/carbon';

import ShareAndInviteDialogBox from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import {
  SelectedDatasource,
  datasourceInstanaAgentPath,
  datasourceOtelCollectorPath,
  datasourceTypes
} from 'in-plg/navigation/paths';
import { triggerFreeTrialSelectionSegmentEvent } from 'in-plg/components/NoviceToPro/segment';
import { FreeTrialEntries, getEntriesForFreeTrialV2 } from 'in-plg/pages/onboarding/content';
import { getSelectedOptionValue } from 'in-plg/components/NoviceToPro/GetStartedFreetrial';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { score, filter } from 'in-plg/pages/onboarding/content/ContentUtils';
import HeaderV2, { breadcrumb } from 'in-plg/components/HeaderV2/HeaderV2';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import useAuthOverview from 'in-settings/hooks/useAuthOverview';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import createTracker from 'in-waiting-for-deployment/tracker';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { pageNames } from 'in-services/tracking/pageNames';
import CardGridV2 from 'in-plg/components/Card/CardGridV2';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './AgentCatalogOnboarding.mless';

interface AgentCatalogOnboarding {
  fromOnboarding: boolean;
  selectedDatasource?: SelectedDatasource;
}

export default function AgentCatalogOnboarding({ fromOnboarding, selectedDatasource }: AgentCatalogOnboarding) {
  const trackingService = !fromOnboarding ? createTracker('agent.installation') : createTracker('onboarding');
  const entities = getEntriesForFreeTrialV2();
  const userEmail = user?.email;
  const encodedUserEmail = encodeURIComponent(userEmail ?? '');
  const url = `https://www.ibm.com/account/reg/us-en/signup?formid=urx-52153&email=${encodedUserEmail}`;

  const clickPlayWith = (): void => {
    const data = { requiredProperty: 'Onboarding.sandBox' };
    triggerFreeTrialSelectionSegmentEvent(data);
  };

  const [role] = useCurrentUserRole();
  const invitePermissions = role?.canConfigureUsers;
  const [authOverview] = useAuthOverview({ preventRequest: !invitePermissions });

  const permissionToShowInvite = invitePermissions && authOverview?.defaultLogin;

  let [query, setQuery] = useState('');

  let [filteredEntities, SetFilteredEntities] = useState<FreeTrialEntries>(entities);

  const selectedOption = getSelectedOptionValue();
  const orderedEntities = {} as FreeTrialEntries;

  if (selectedOption === 'deployAgent' || selectedOption === 'other') {
    orderedEntities.instanaagent = filteredEntities.instanaagent;
    orderedEntities.otelcollector = filteredEntities.otelcollector;
  } else {
    orderedEntities.otelcollector = filteredEntities.otelcollector;
    orderedEntities.instanaagent = filteredEntities.instanaagent;
  }
  const onQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    let filteredEntitiesLocal = entities;
    if (newQuery !== '') {
      (Object.keys(entities) as Array<keyof typeof entities>).forEach(datasource => {
        filteredEntitiesLocal = {
          ...filteredEntitiesLocal,
          [datasource]: {
            ...filteredEntitiesLocal[datasource],
            data: filter(score(filteredEntitiesLocal[datasource].data, newQuery))
          }
        };
      });
    }
    SetFilteredEntities(filteredEntitiesLocal);
  };

  useEffect(() => {
    trackingService.catalogPageOpened();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={locals.container}>
        <div className={locals.mainContent}>
          <Stack orientation="vertical" gap={4}>
            <ViewTrackingMeta
              data={{
                productArea: productAreas.agents,
                pageRootName: pageNames.agent_catalog
              }}
            />
            <>
              {!fromOnboarding && selectedDatasource && (
                <HeaderV2
                  breadcrumb={getBreadcrump(selectedDatasource)}
                  title={t('in-plg:agentDetails.common.datasourceCatalogHeader', {
                    context: getDatasourceHeadingContext(selectedDatasource)
                  })}
                />
              )}
            </>

            <LeftRightPadding>
              <Stack orientation="vertical">
                {fromOnboarding && (
                  <Typography variant="heading-04">{t('in-plg:agentDetails.common.dataSources')}</Typography>
                )}

                {showSearch(entities, selectedDatasource, fromOnboarding) && (
                  <SearchInput
                    width="100%"
                    onChange={onQueryChange}
                    query={query}
                    autoFocus
                    onBlur={() => {
                      if (query) {
                        trackingService.catalogPageSearchUsed({ query });
                      }
                    }}
                    hasError={false}
                    placeholder={t('in-components:searchInput.placeholderSearch')}
                  />
                )}

                <CardGridV2
                  data={orderedEntities}
                  fromOnboarding={fromOnboarding}
                  selectedDatasource={selectedDatasource}
                />
              </Stack>
            </LeftRightPadding>
          </Stack>
        </div>
        <div className={locals.sidePanel}>
          <LeftRightPadding>
            <Stack orientation="vertical" gap={4}>
              <Stack orientation="vertical" gap={4} className={locals.sidePanelBorder}>
                <SvgIcon type="lib_share_knowledge" size="s" />
                <Typography variant="body-01">{t('in-plg:agentEnforcement.inviteForAgentInstallation')}</Typography>
                <Button
                  kind="tertiary"
                  renderIcon={() => <IconForButton icon="lib_arrow_right" iconSize="xs" />}
                  onClick={() =>
                    addActiveDialog(<ShareAndInviteDialogBox permissionToShowInvite={permissionToShowInvite} />)
                  }
                >
                  {t('in-plg:agentEnforcement.inviteButton')}
                </Button>
              </Stack>
              <Stack orientation="vertical" gap={4} className={locals.sidePanelBorder}>
                <SvgIcon type="lib_data" size="s" />
                <Typography variant="body-01">{t('in-plg:agentEnforcement.playWithRedirectionDescription')}</Typography>
                <Button
                  kind="tertiary"
                  className={locals.playWithButton}
                  renderIcon={() => <IconForButton icon="lib_arrow_right" iconSize="xs" />}
                  onClick={clickPlayWith}
                  href={url}
                  target="_blank"
                >
                  {t('in-plg:agentEnforcement.playWithRedirectionButton')}
                </Button>
              </Stack>
              <Stack gap={4}>
                <Typography variant="heading-02">{t('in-plg:agentEnforcement.resources')}</Typography>
                <Link
                  target="_blank"
                  href="https://ibm.biz/insta-getstarted"
                  renderIcon={() => <SvgIcon type="lib_arrow_right" size="xs" />}
                >
                  {t('in-plg:agentEnforcement.ibmDocumentation')}
                </Link>
                <Link
                  target="_blank"
                  href="https://ibm.biz/Support-Troubleshooting"
                  renderIcon={() => <SvgIcon type="lib_arrow_right" size="xs" />}
                >
                  {t('in-plg:agentEnforcement.contactSupport')}
                </Link>
              </Stack>
            </Stack>
          </LeftRightPadding>
        </div>
      </div>
    </>
  );
}

const getDatasourceHeadingContext = (type: string) => {
  let context = '';
  switch (type) {
    case datasourceTypes.instana_agent:
      context = 'INSTANA_AGENT';
      break;
    case datasourceTypes.otel_collector:
      context = 'OTEL_COLLECTOR';
      break;
  }
  return context;
};

const getBreadcrump = (selectedDatasource: string) => {
  let firstLevel: breadcrumb = { title: '', href: null };
  let secondLevel: breadcrumb = { title: '', href: null };
  if (selectedDatasource === datasourceTypes.instana_agent) {
    firstLevel = { title: t('in-plg:agentDetails.common.dataSources'), href: datasourceInstanaAgentPath };
    secondLevel = { title: t('in-plg:agentDetails.common.instanaAgents'), href: null };
  } else if (selectedDatasource === datasourceTypes.otel_collector) {
    firstLevel = { title: t('in-plg:agentDetails.common.dataSources'), href: datasourceOtelCollectorPath };
    secondLevel = { title: t('in-plg:agentDetails.common.openTelemetryCollectors'), href: null };
  }
  return [firstLevel, secondLevel];
};

const showSearch = (entities: FreeTrialEntries, selectedDatasource?: SelectedDatasource, fromOnboarding?: boolean) => {
  if (selectedDatasource && entities[selectedDatasource].data.length > 1) return true;
  if (selectedDatasource && entities[selectedDatasource].data.length <= 1) return false;
  if (!selectedDatasource && fromOnboarding) return true;
  return false;
};
