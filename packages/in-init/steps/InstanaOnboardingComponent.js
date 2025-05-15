/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ThemeProvider } from '@instana/components';
import { useObservable } from '@instana/hooks';

import FullViewOnboardingWidget from 'in-waiting-for-deployment/components/FullViewOnboardingWidget';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import useResultFromApiPing from 'in-hooks/useResultFromApiPing';
import createTracker from 'in-waiting-for-deployment/tracker';
import checkIfUserCanPass from 'in-init/steps/checkUserPass';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import MessageFlyout from 'in-components/MessageFlyout';
import getUsageInfo from 'in-subscription/getUsageInfo';
import GlobalTheme from 'in-themes/GlobalTheme';
import { getUnitKeys } from 'in-api/unitKeys';
import config from 'in-services/config';

const trackingService = createTracker('onboarding');

export default function InstanaOnboardingComponent({ onDialogSkip }) {
  useDisabledBodyScroll();

  const accountConfig = useObservable(getUsageInfo(), []);
  const apiCallSatisfied = useResultFromApiPing({
    url: `/api/infrastructure-monitoring/monitoring-state`,
    // users who ever had something monitoring can skip the dialog. Also engineers
    checkResult: result => checkIfUserCanPass(result.hasEntities)
  });
  const keys = useObservable(getUnitKeys, []) ?? '{agentKey:AGENT_KEY,downloadKey:DOWNLOAD_KEY}';

  if (!accountConfig) {
    return <LoadingIndicator height="100vh" />;
  }

  return (
    <ErrorBoundary name="Instana onboarding dialog">
      <GlobalTheme>
        <ThemeProvider>
          <DialogPresenter />

          <MessageFlyout onlyShowUsageRelatedMessages />
          <FullViewOnboardingWidget
            isAgentDeployed={apiCallSatisfied}
            isBackendAvailable
            disableAwsSensorDocumentation
            agentKey={keys.agentKey}
            downloadKey={keys.downloadKey}
            tenant={config.tenant}
            tenantUnit={config.tenantUnit}
            butlerDomain={config.butlerDomain}
            trackingIdPrefix="onboarding"
            activeLicenseType={accountConfig.activeLicenseType}
            getRedirectButtonProperties={() => ({
              children: 'Go to Instana!',
              onClick: () => {
                onDialogSkip();
                trackingService.gotoInstanaButtonClicked();
              }
            })}
            agentEndpoint={config.agentEndpoint}
            agentEndpointPort={config.agentEndpointPort}
            serverlessEndpoint={config.serverlessEndpoint}
          />
        </ThemeProvider>
      </GlobalTheme>
    </ErrorBoundary>
  );
}
