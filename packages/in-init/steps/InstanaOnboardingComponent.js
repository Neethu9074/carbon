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
    checkResult: result => result.firstKnownReportingTime > 0 || isInstanaEngineer
  }),
  connect({ agentKey: getAgentKey() })
)(InstanaOnboardingComponent);

function InstanaOnboardingComponent({ observable, apiCallSatisfied, agentKey }) {
  return (
    <ErrorBoundary name="Instana onboarding dialog">
      <DialogPresenter />

      <DisabledBodyScroll />

      <MessageFlyout filterRegularMessages />

      <FullViewOnboardingWidget
        isAgentDeployed={apiCallSatisfied}
        isBackendAvailable
        disableAwsSensorDocumentation
        agentKey={agentKey || 'AGENT_KEY'}
        tenant={config.tenant}
        tenantUnit={config.tenantUnit}
        region={config.region}
        butlerDomain={config.butlerDomain}
        getRedirectButtonProperties={() => ({
          disabled: !apiCallSatisfied,
          children: 'Go to Instana!',
          onClick: () => observable.emit(true)
        })}
      />
    </ErrorBoundary>
  );
}
