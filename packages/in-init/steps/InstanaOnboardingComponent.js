import { compose } from 'recompose';
import React from 'react';

import FullViewOnboardingWidget from 'in-waiting-for-deployment/components/FullViewOnboardingWidget';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import getResultFromApiPing from 'in-hoc/getResultFromApiPing';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import MessageFlyout from 'in-components/MessageFlyout';
import { isInstanaEngineer } from 'in-stores/user';
import { getAgentKey } from 'in-api/agentKey';
import config from 'in-services/config';
import connect from 'in-hoc/connectTo';

export default compose(
  getResultFromApiPing({
    url: `/api/infrastructure-monitoring/monitoring-state`,
    // users who ever had something monitoring can skip the dialog. Also engineers
    checkResult: result => result.firstKnownReportingTime > 0
  }),
  connect({ agentKey: getAgentKey() })
)(InstanaOnboardingComponent);

function InstanaOnboardingComponent({ onDialogSkip, apiCallSatisfied, agentKey = 'AGENT_KEY' }) {
  return (
    <ErrorBoundary name="Instana onboarding dialog">
      <DialogPresenter />

      <DisabledBodyScroll />

      <MessageFlyout filterRegularMessages />

      <FullViewOnboardingWidget
        isAgentDeployed={apiCallSatisfied}
        isBackendAvailable
        disableAwsSensorDocumentation
        agentKey={agentKey}
        tenant={config.tenant}
        tenantUnit={config.tenantUnit}
        agentEndpoint={config.agentEndpoint}
        butlerDomain={config.butlerDomain}
        getRedirectButtonProperties={() => ({
          disabled: !apiCallSatisfied && !isInstanaEngineer,
          children: !apiCallSatisfied && isInstanaEngineer ? 'Engs can always pass' : 'Go to Instana!',
          onClick: onDialogSkip
        })}
      />
    </ErrorBoundary>
  );
}
