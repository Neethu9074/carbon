/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { Stack } from '@instana/components';

import createTracker, { CreateTrackerProps } from 'in-waiting-for-deployment/tracker';
import { getEntriesForFreeTrial } from 'in-plg/pages/onboarding/content';
import ContentProps from 'in-plg/pages/onboarding/content/ContentProps';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Header from 'in-plg/components/Header/Header';
import config from 'in-services/config';
import { t } from 'in-i18n';

interface BreadCrumbItem {
  icon?: string;
  title?: string;
  href?: string;
}

interface AgentViewRouterProps {
  selectedService: string;
  fromOnboarding?: boolean;
  agentKey: string;
  downloadKey: string;
}

export default function AgentViewRouter({
  selectedService,
  fromOnboarding = false,
  agentKey,
  downloadKey
}: AgentViewRouterProps) {
  const entities: ContentProps[] = getEntriesForFreeTrial();
  const selectedEntity = entities.find(entity => entity.id === selectedService);
  const technology = selectedEntity?.subTechnology ?? selectedEntity;

  const createBreadCrumb = (): BreadCrumbItem[] => {
    return [
      {
        icon: 'lib_infrastructure',
        title: t('in-plg:agentDetails.common.agentDeployment'),
        href: `#/agents${fromOnboarding ? '/onboarding' : ''}/installation`
      },
      {
        icon: selectedEntity?.icon,
        title: selectedEntity?.title
      }
    ];
  };

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
      <Header crumbs={createBreadCrumb()} />
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
          />
        )}
      </Stack>
    </Stack>
  );
}
