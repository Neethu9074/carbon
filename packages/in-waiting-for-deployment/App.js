import { compose } from 'recompose';
import React from 'react';

import FullViewOnboardingWidget from 'in-waiting-for-deployment/components/FullViewOnboardingWidget';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import getResultFromApiPing from 'in-hoc/getResultFromApiPing';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import config from 'in-services/config';

import 'in-themes/foundation.less';

export default compose(
  getResultFromApiPing({
    url: 'https://instana.io/portal2/api/selfservice/unitStatus/' + config.tenant + '/' + config.tenantUnit,
    checkResult: result => result.status === 'running'
  })
)(App);

function App({ apiCallSatisfied }) {
  return (
    <ErrorBoundary name="app">
      <DialogPresenter />

      <DisabledBodyScroll />

      <FullViewOnboardingWidget
        isRestricted
        disableAwsSensorDocumentation
        isAgentDeployed={false}
        isBackendAvailable={apiCallSatisfied}
        agentKey={config.agentKey}
        tenant={config.tenant}
        tenantUnit={config.tenantUnit}
        agentEndpoint={config.agentEndpoint}
        agentEndpointPort={config.agentEndpointPort}
        butlerDomain={config.butlerDomain}
        trackingIdPrefix="onboarding"
        getRedirectButtonProperties={() => ({
          disabled: !apiCallSatisfied,
          href: `https://${config.tenantUnit}-${config.tenant}.${config.tenantUnitDomainSuffix}`,
          children: 'Sign in to Instana'
        })}
      />
      <TooltipPresenter />
    </ErrorBoundary>
  );
}
