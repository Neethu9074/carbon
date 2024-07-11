/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// Fixing the styling of any Toggle on the waiting page
//
// to be removed, after Toggle was migrated.
// This loads the styling of react-toggle
import 'react-toggle/style.css';
import React from 'react';

import { ThemeProvider } from '@instana/components';

import FullViewOnboardingWidget from 'in-waiting-for-deployment/components/FullViewOnboardingWidget';
import OnboardingWidgetPresenterV2 from 'in-plg/pages/onboarding/OnboardingWidgetPresenterV2';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import useResultFromApiPing from 'in-hooks/useResultFromApiPing';
import createTracker from 'in-waiting-for-deployment/tracker';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import GlobalTheme from 'in-themes/GlobalTheme';
import config from 'in-services/config';

const trackingService = createTracker('onboarding');

export default function App() {
  useDisabledBodyScroll();

  return (
    <ErrorBoundary name="app">
      <GlobalTheme>
        <ThemeProvider theme="default">
          <DialogPresenter />

          <FullViewOnboardingWidget Renderer={Renderer} />
          <TooltipPresenter />
        </ThemeProvider>
      </GlobalTheme>
    </ErrorBoundary>
  );
}

function Renderer() {
  const apiCallSatisfied = useResultFromApiPing({
    url: 'https://instana.io/portal2/api/selfservice/unitStatus/' + config.tenant + '/' + config.tenantUnit,
    checkResult: result => result.status === 'running'
  });

  return (
    <OnboardingWidgetPresenterV2
      isRestricted
      disableAwsSensorDocumentation
      isAgentDeployed={false}
      isBackendAvailable={apiCallSatisfied}
      agentKey={config.agentKey}
      downloadKey={config.agentKey}
      tenant={config.tenant}
      tenantUnit={config.tenantUnit}
      butlerDomain={config.butlerDomain}
      trackingIdPrefix="onboarding"
      getRedirectButtonProperties={() => ({
        disabled: !apiCallSatisfied,
        href: `https://${config.tenantUnit}-${config.tenant}.${config.tenantUnitDomainSuffix}`,
        children: 'Sign in to Instana',
        onClick: () => {
          trackingService.signInToInstanaButtonClicked();
        }
      })}
      agentEndpoint={config.agentEndpoint}
      agentEndpointPort={config.agentEndpointPort}
      serverlessEndpoint={config.serverlessEndpoint}
    />
  );
}
