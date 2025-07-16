/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';

import { Stack } from '@instana/components';

import {
  SelectedDatasource,
  datasourceInstanaAgentCatalog,
  datasourceInstanaAgentPath,
  datasourceOtelCollectorPath,
  datasourceOtemCollectorCatalog,
  datasourceTypes
} from 'in-plg/navigation/paths';
import createTracker, { CreateTrackerProps } from 'in-waiting-for-deployment/tracker';
import { getEntriesForFreeTrialV2 } from 'in-plg/pages/onboarding/content';
import HeaderV2, { breadcrumb } from 'in-plg/components/HeaderV2/HeaderV2';
import ContentProps from 'in-plg/pages/onboarding/content/ContentProps';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import config from 'in-services/config';
import { t } from 'in-i18n';

interface AgentViewRouterProps {
  selectedService: string;
  fromOnboarding?: boolean;
  agentKey: string;
  downloadKey: string;
  selectedDatasource?: SelectedDatasource;
}

const AgentViewRouterV2 = ({
  selectedService,
  fromOnboarding = false,
  agentKey,
  downloadKey,
  selectedDatasource
}: AgentViewRouterProps) => {
  const entities: ContentProps[] = Object.values(getEntriesForFreeTrialV2()).flatMap(entry => entry.data);
  const selectedEntity = entities.find(entity => entity.id === selectedService);
  const technology = selectedEntity?.subTechnology ?? selectedEntity;

  const trackingService: CreateTrackerProps = !fromOnboarding
    ? createTracker('agent.installation')
    : createTracker('onboarding');

  useEffect(() => {
    trackingService.agentDetailsPageOpened();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.agents,
          pageRootName: selectedEntity?.pageName
        }}
      />
      <HeaderV2
        breadcrumb={getBreadcrump(selectedEntity, selectedDatasource, fromOnboarding)}
        title={selectedEntity?.title ?? ''}
      />
      <Stack>
        {technology?.Content && selectedEntity?.id && (
          <technology.Content
            id={selectedEntity.id}
            agentKey={agentKey}
            downloadKey={downloadKey}
            tenant={config.tenant}
            tenantUnit={config.tenantUnit}
            butlerDomain={config.butlerDomain}
            agentEndpoint={config.agentEndpoint}
            agentEndpointPort={config.agentEndpointPort}
            serverlessEndpoint={config.serverlessEndpoint}
            instanaDomain={config.agentInstallDomain ?? 'io'}
            fromOnboarding={fromOnboarding}
            region={config.region}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default AgentViewRouterV2;

const getBreadcrump = (
  selectedEntity: ContentProps | undefined,
  selectedDatasource?: SelectedDatasource,
  fromOnboarding?: boolean
) => {
  let firstLevel: breadcrumb = { title: '', href: null };
  let secondLevel: breadcrumb = { title: '', href: null };
  let thirdLevel: breadcrumb = { title: '', href: null };
  if (fromOnboarding) {
    return [
      {
        title: t('in-plg:agentDetails.common.dataSources'),
        href: `/datasources/onboarding/installation`
      },
      {
        title: selectedEntity?.title ?? '',
        href: `/datasources/onboarding/installation/${selectedEntity?.id}` ?? ''
      }
    ];
  }
  if (selectedDatasource === datasourceTypes.instana_agent) {
    firstLevel = { title: t('in-plg:agentDetails.common.dataSources'), href: datasourceInstanaAgentPath };
    secondLevel = { title: t('in-plg:agentDetails.common.instanaAgents'), href: datasourceInstanaAgentCatalog };
    thirdLevel = { title: selectedEntity?.title ?? '', href: null };
  } else if (selectedDatasource === datasourceTypes.otel_collector) {
    firstLevel = { title: t('in-plg:agentDetails.common.dataSources'), href: datasourceOtelCollectorPath };
    secondLevel = {
      title: t('in-plg:agentDetails.common.openTelemetryCollectors'),
      href: datasourceOtemCollectorCatalog
    };
    thirdLevel = { title: selectedEntity?.title ?? '', href: null };
  }
  return [firstLevel, secondLevel, thirdLevel];
};
