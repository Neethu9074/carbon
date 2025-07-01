/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { ThemeProvider } from '@instana/components';
import { useObservable } from '@instana/hooks';

import FullViewOnboardingWidget from 'in-waiting-for-deployment/components/FullViewOnboardingWidget';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import useResultFromApiPing from 'in-hooks/useResultFromApiPing';
import createTracker from 'in-waiting-for-deployment/tracker';
import { newOTelPageEnabled } from 'in-services/featureFlags';
import checkIfUserCanPass from 'in-init/steps/checkUserPass';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import MessageFlyout from 'in-components/MessageFlyout';
import getUsageInfo from 'in-subscription/getUsageInfo';
import useTimeConfig from 'in-hooks/useTimeConfig';
import GlobalTheme from 'in-themes/GlobalTheme';
import { getUnitKeys } from 'in-api/unitKeys';
import config from 'in-services/config';

const trackingService = createTracker('onboarding');

export default function InstanaOnboardingComponent({ onDialogSkip }) {
  useDisabledBodyScroll();

  const [OTelDataLoading, setOTelDataLoading] = useState(true);
  const timeConfig = useTimeConfig();
  const accountConfig = useObservable(getUsageInfo(), []);
  const apiCallSatisfied = useResultFromApiPing({
    url: `/api/infrastructure-monitoring/monitoring-state`,
    // users who ever had something monitoring can skip the dialog. Also engineers
    checkResult: result => checkIfUserCanPass(result.hasEntities)
  });
  const keys = useObservable(getUnitKeys, []) ?? '{agentKey:AGENT_KEY,downloadKey:DOWNLOAD_KEY}';

  useEffect(() => {
    // If the new OpenTelemetry page is not enabled, we don't need to check for OTel collectors.
    if (!newOTelPageEnabled) {
      setOTelDataLoading(false);
      return;
    }
    // We check if there is at least one OTel collector entity present.
    // If there is, we skip the onboarding catalog page, otherwise we show it.
    const subscription = getEntities({
      filter: {
        tagFilterExpression: {
          logicalOperator: 'AND',
          type: 'EXPRESSION',
          elements: [
            {
              name: 'otel.attribute.entity.type',
              operator: 'EQUALS',
              value: 'otel-collector',
              type: 'TAG_FILTER',
              entity: NOT_APPLICABLE
            }
          ]
        },
        timeConfig
      },
      order: { by: 'id', direction: 'ASC' },
      type: 'openTelemetry',
      pagination: { retrievalSize: 1 } // We only need to check if atleast one entry is present.
    }).subscribe(result => {
      if (result?.data?.items?.length) {
        onDialogSkip();
      } else {
        setOTelDataLoading(false);
      }
    });
    return () => subscription.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeConfig]);

  if (!accountConfig || OTelDataLoading) {
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
