/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import InstallDocumentation from 'in-waiting-for-deployment/components/OnboardingWidget/InstallDocumentation';
import OnboardingWidget from 'in-waiting-for-deployment/components/OnboardingWidget/OnboardingWidget';
import { getUnitKeys } from 'in-api/unitKeys';
import config from 'in-services/config';

import locals from './AgentInstallationView.mless';

export default function AgentInstallationView() {
  return <OnboardingWidget Renderer={Renderer} trackingIdPrefix="agent.installation" />;
}

function Renderer(props) {
  const unitKeys = useObservable(getUnitKeys(), []) ?? '{agentKey:AGENT_KEY,downloadKey:DOWNLOAD_KEY}';

  return (
    <div className={locals.wrapper}>
      <InstallDocumentation
        {...props}
        agentKey={unitKeys.agentKey}
        downloadKey={unitKeys.downloadKey}
        tenant={config.tenant}
        tenantUnit={config.tenantUnit}
        butlerDomain={config.butlerDomain}
        agentEndpoint={config.agentEndpoint}
        agentEndpointPort={config.agentEndpointPort}
        serverlessEndpoint={config.serverlessEndpoint}
        withoutHeightRestriction
      />
    </div>
  );
}
