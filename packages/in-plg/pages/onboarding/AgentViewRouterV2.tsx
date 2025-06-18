/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';

import { Stack } from '@instana/components';

import createTracker, { CreateTrackerProps } from 'in-waiting-for-deployment/tracker';
import { getEntriesForFreeTrialV2 } from 'in-plg/pages/onboarding/content';
import ContentProps from 'in-plg/pages/onboarding/content/ContentProps';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import HeaderV2 from 'in-plg/components/HeaderV2/HeaderV2';
import config from 'in-services/config';

interface AgentViewRouterProps {
  selectedService: string;
  fromOnboarding?: boolean;
  agentKey: string;
  downloadKey: string;
}

const AgentViewRouterV2 = ({
  selectedService,
  fromOnboarding = false,
  agentKey,
  downloadKey
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
        breadcrumb={[
          { title: 'Data sources', href: '/datasources/onboarding/installation' },
          {
            title: selectedEntity?.id ?? '',
            href: `/datasources/onboarding/installation/${selectedEntity?.id}` ?? ''
          }
        ]}
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
          />
        )}
      </Stack>
    </Stack>
  );
};

export default AgentViewRouterV2;
