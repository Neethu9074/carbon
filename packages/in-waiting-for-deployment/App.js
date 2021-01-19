/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose } from 'recompose';
import React from 'react';

import FullViewOnboardingWidget from 'in-waiting-for-deployment/components/FullViewOnboardingWidget';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import getResultFromApiPing from 'in-hoc/getResultFromApiPing';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import GlobalTheme from 'in-themes/GlobalTheme';
import config from 'in-services/config';

import 'in-themes/foundation.less';

export default compose(
  getResultFromApiPing({
    url: 'https://instana.io/portal2/api/selfservice/unitStatus/' + config.tenant + '/' + config.tenantUnit,
    checkResult: result => result.status === 'running'
  })
)(App);

function App({ apiCallSatisfied }) {
  useDisabledBodyScroll();

  return (
    <ErrorBoundary name="app">
      <GlobalTheme>
        <DialogPresenter />

        <FullViewOnboardingWidget
          isRestricted
          disableAwsSensorDocumentation
          isAgentDeployed={false}
          isBackendAvailable={apiCallSatisfied}
          agentKey={config.agentKey}
          tenant={config.tenant}
          tenantUnit={config.tenantUnit}
          butlerDomain={config.butlerDomain}
          trackingIdPrefix="onboarding"
          getRedirectButtonProperties={() => ({
            disabled: !apiCallSatisfied,
            href: `https://${config.tenantUnit}-${config.tenant}.${config.tenantUnitDomainSuffix}`,
            children: 'Sign in to Instana'
          })}
          agentEndpoint={config.agentEndpoint}
          agentEndpointPort={config.agentEndpointPort}
          serverlessEndpoint={config.serverlessEndpoint}
        />
        <TooltipPresenter />
      </GlobalTheme>
    </ErrorBoundary>
  );
}
