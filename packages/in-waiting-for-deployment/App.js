/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { ThemeProvider, setThemeOverride, getThemeOverride } from '@instana/components';

import FullViewOnboardingWidget from 'in-waiting-for-deployment/components/FullViewOnboardingWidget';
import OnboardingWidgetPresenterV2 from 'in-plg/pages/onboarding/OnboardingWidgetPresenterV2';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import { SwitchTheme, fallbackTheme } from 'in-themes/SwitchTheme';
import useResultFromApiPing from 'in-hooks/useResultFromApiPing';
import createTracker from 'in-waiting-for-deployment/tracker';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import config, { baseUrl } from 'in-services/config';
import GlobalTheme from 'in-themes/GlobalTheme';

const trackingService = createTracker('onboarding');

export default function App() {
  const themeOverride = getThemeOverride() ?? fallbackTheme;
  const [theme, setTheme] = useState(themeOverride);

  return (
    <ErrorBoundary name="app">
      <GlobalTheme>
        <SwitchTheme
          theme={theme}
          setOverride={theme => {
            setThemeOverride(theme);
            setTheme(theme);
          }}
        />
        <ThemeProvider theme={theme ?? fallbackTheme}>
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
        href: baseUrl,
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
