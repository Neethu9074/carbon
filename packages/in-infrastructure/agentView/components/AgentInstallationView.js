import React from 'react';

import InstallDocumentation from 'in-waiting-for-deployment/components/OnboardingWidget/InstallDocumentation';
import OnboardingWidget from 'in-waiting-for-deployment/components/OnboardingWidget/OnboardingWidget';
import { getAgentKey } from 'in-api/agentKey';
import connectTo from 'in-hoc/connectTo';
import config from 'in-services/config';

import locals from './AgentInstallationView.mless';

export default connectTo(
  {
    agentKey: getAgentKey()
  },
  function AgentInstallationView({ agentKey = 'AGENT_KEY' }) {
    function Renderer(props) {
      return (
        <div className={locals.wrapper}>
          <InstallDocumentation
            {...props}
            contentClassName={locals.installationContent}
            agentKey={agentKey}
            tenant={config.tenant}
            tenantUnit={config.tenantUnit}
            butlerDomain={config.butlerDomain}
            agentEndpoint={config.agentEndpoint}
            agentEndpointPort={config.agentEndpointPort}
            serverlessEndpoint={config.serverlessEndpoint}
          />
        </div>
      );
    }

    return <OnboardingWidget Renderer={Renderer} trackingIdPrefix="agent.installation" />;
  }
);
