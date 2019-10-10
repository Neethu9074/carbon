import { compose } from 'recompose';
import React from 'react';

import FullViewOnboardingWidget from 'in-waiting-for-deployment/components/FullViewOnboardingWidget';
import getResultFromApiPing from 'in-hoc/getResultFromApiPing';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { getAgentKey } from 'in-api/agentKey';
import config from 'in-services/config';
import connect from 'in-hoc/connectTo';

export default compose(
  getResultFromApiPing({
    url: `/api/infrastructure-monitoring/monitoring-state`,
    checkResult: result => result.hostCount > 0
  }),
  connect({ agentKey: getAgentKey() })
)(InstanaOnboardingComponent);

function InstanaOnboardingComponent({ observable, apiCallSatisfied, agentKey }) {
  return (
    <ErrorBoundary name="Instana onboarding dialog">
      <DialogPresenter />
      <FullViewOnboardingWidget
        isAgentDeployed={apiCallSatisfied}
        isBackendAvailable
        agentKey={agentKey || 'AGENT_KEY'}
        tenant={config.tenant}
        tenantUnit={config.tenantUnit}
        region={config.region}
        getRedirectButtonProperties={() => ({
          disabled: !apiCallSatisfied,
          children: 'Go to Instana!',
          onClick: () => observable.emit(true)
        })}
      />
    </ErrorBoundary>
  );
}
