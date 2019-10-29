import React, { useState } from 'react';

import InstallDocumentation from 'in-waiting-for-deployment/components/OnboardingWidget/InstallDocumentation';
import { getAgentKey } from 'in-api/agentKey';
import connectTo from 'in-hoc/connectTo';
import config from 'in-services/config';

import locals from './AgentInstallationView.mless';

export default connectTo(
  {
    agentKey: getAgentKey()
  },
  function AgentInstallationView({ agentKey }) {
    const [selectedEntryIndex, onEntrySelected] = useState(0);
    const [selectedSubEntryIndex, onSubEntrySelected] = useState(undefined);

    return (
      <div className={locals.wrapper}>
        <InstallDocumentation
          contentClassName={locals.installationContent}
          agentKey={agentKey || 'AGENT_KEY'}
          tenant={config.tenant}
          tenantUnit={config.tenantUnit}
          region={config.region}
          selectedEntryIndex={selectedEntryIndex}
          onEntrySelected={index => {
            onEntrySelected(index);
            onSubEntrySelected(undefined);
          }}
          selectedSubEntryIndex={selectedSubEntryIndex}
          onSubEntrySelected={onSubEntrySelected}
        />
      </div>
    );
  }
);
