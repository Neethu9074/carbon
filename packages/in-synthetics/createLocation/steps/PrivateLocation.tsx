/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { dummyPoPProperties, PoPInstallationPropertiesResponse } from 'in-synthetics/utils/constants';
import getPoPInstallationProperties from 'in-synthetics/subscriptions/getPoPInstallationProperties';
import DeployTabSelection from 'in-synthetics/createLocation/steps/DeployTabSelection';
import { syntheticInstanaHostedPoPEnabled } from 'in-services/featureFlags';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { role } from 'in-stores/user';

const PrivateLocation = () => {
  const popProperties: PoPInstallationPropertiesResponse =
    useObservable<any, [number]>(() => getPoPInstallationProperties({ installationType: 'simple' }), [0]) ||
    dummyPoPProperties;

  if (!popProperties.progress.loading && role?.canConfigureSyntheticLocations && syntheticInstanaHostedPoPEnabled) {
    return (
      <DeployTabSelection
        downloadKey={popProperties.data?.downloadKey || ''}
        agentKey={popProperties.data?.agentKey || ''}
        syntheticAcceptorURL={popProperties.data?.syntheticAcceptorURL || ''}
      />
    );
  }
  return <LoadingIndicator />;
};

export default PrivateLocation;
