/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose } from 'recompose';
import React from 'react';

import FullViewOnboardingWidget from 'in-waiting-for-deployment/components/FullViewOnboardingWidget';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import getResultFromApiPing from 'in-hoc/getResultFromApiPing';
import checkIfUserCanPass from 'in-init/steps/checkUserPass';
import DialogPresenter from 'in-components/DialogPresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import MessageFlyout from 'in-components/MessageFlyout';
import { getUnitKeys } from 'in-api/unitKeys';
import config from 'in-services/config';
import connect from 'in-hoc/connectTo';

export default compose(
  getResultFromApiPing({
    url: `/api/infrastructure-monitoring/monitoring-state`,
    // users who ever had something monitoring can skip the dialog. Also engineers
    checkResult: result => checkIfUserCanPass(result.hasEntities)
  }),
  connect({ keys: getUnitKeys() })
)(InstanaOnboardingComponent);

function InstanaOnboardingComponent({
  onDialogSkip,
  apiCallSatisfied,
  keys = '{agentKey:AGENT_KEY,downloadKey:DOWNLOAD_KEY}'
}) {
  useDisabledBodyScroll();

  return (
    <ErrorBoundary name="Instana onboarding dialog">
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
        getRedirectButtonProperties={() => ({
          children: 'Go to Instana!',
          onClick: onDialogSkip
        })}
        agentEndpoint={config.agentEndpoint}
        agentEndpointPort={config.agentEndpointPort}
        serverlessEndpoint={config.serverlessEndpoint}
      />
    </ErrorBoundary>
  );
}
