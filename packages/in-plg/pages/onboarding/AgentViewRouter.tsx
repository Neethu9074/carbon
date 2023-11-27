/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Stack } from '@instana/components';

import { getEntriesForFreeTrial } from 'in-plg/pages/onboarding/content';
import ContentProps from 'in-plg/pages/onboarding/content/ContentProps';
//@ts-expect-error
import { getUnitKeys } from 'in-api/unitKeys';
import Header from 'in-plg/components/Header/Header';
import config from 'in-services/config';

interface UnitKeys {
  agentKey: string;
  downloadKey: string;
}

export default function AgentViewRouter({ selectedService }: { selectedService: string }) {
  const unitKeysResp: UnitKeys = useObservable<UnitKeys, []>(getUnitKeys(), []) ?? {
    agentKey: 'agentKey',
    downloadKey: 'downloadKey'
  };

  const entities: ContentProps[] = getEntriesForFreeTrial();
  const selectedEntity = entities.find(entity => entity.id === selectedService);
  const technology = selectedEntity?.subTechnology ?? selectedEntity;

  const createBreadCrumb = () => {
    return [
      {
        icon: 'lib_infrastructure',
        title: 'Agents Catalog'
      },
      {
        icon: selectedEntity?.icon,
        title: selectedEntity?.title
      }
    ];
  };

  return (
    <Stack>
      <Header crumbs={createBreadCrumb()} />
      <Stack>
        {technology?.Content && (
          <technology.Content
            id={selectedEntity?.id}
            agentKey={unitKeysResp.agentKey}
            downloadKey={unitKeysResp.downloadKey}
            tenant={config.tenant}
            tenantUnit={config.tenantUnit}
            butlerDomain={config.butlerDomain}
            agentEndpoint={config.agentEndpoint}
            agentEndpointPort={config.agentEndpointPort}
            // serverlessEndpoint={config.serverlessEndpoint}
            instanaDomain={config.agentInstallDomain ?? 'io'}
          />
        )}
      </Stack>
    </Stack>
  );
}
