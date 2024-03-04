/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { useObservable } from '@instana/hooks';
import { Stack } from '@instana/components';

import createTracker, { CreateTrackerProps } from 'in-waiting-for-deployment/tracker';
import { getEntriesForFreeTrial } from 'in-plg/pages/onboarding/content';
import ContentProps from 'in-plg/pages/onboarding/content/ContentProps';
//@ts-expect-error
import { getUnitKeys } from 'in-api/unitKeys';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Header from 'in-plg/components/Header/Header';
import config from 'in-services/config';
import { t } from 'in-i18n';

interface UnitKeys {
  agentKey: string;
  downloadKey: string;
}

interface BreadCrumbItem {
  icon?: string;
  title?: string;
  href?: string;
  iconColor?: string;
}

const trackingService: CreateTrackerProps = createTracker('agent.installation');

export default function AgentViewRouter({ selectedService }: { selectedService: string }) {
  const unitKeysResp: UnitKeys = useObservable<UnitKeys, []>(getUnitKeys(), []) ?? {
    agentKey: 'agentKey',
    downloadKey: 'downloadKey'
  };

  const entities: ContentProps[] = getEntriesForFreeTrial();
  const selectedEntity = entities.find(entity => entity.id === selectedService);
  const technology = selectedEntity?.subTechnology ?? selectedEntity;

  const createBreadCrumb = (): BreadCrumbItem[] => {
    return [
      {
        icon: 'lib_infrastructure',
        title: t('in-plg:agentDetails.common.agentCatalog'),
        href: '#/agents/installation'
      },
      {
        icon: selectedEntity?.icon,
        title: selectedEntity?.title,
        iconColor: selectedEntity?.iconColor
      }
    ];
  };

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
            agentKey={unitKeysResp.agentKey}
            downloadKey={unitKeysResp.downloadKey}
            tenant={config.tenant}
            tenantUnit={config.tenantUnit}
            butlerDomain={config.butlerDomain}
            agentEndpoint={config.agentEndpoint}
            agentEndpointPort={config.agentEndpointPort}
            serverlessEndpoint={config.serverlessEndpoint}
            instanaDomain={config.agentInstallDomain ?? 'io'}
          />
        )}
      </Stack>
    </Stack>
  );
}
