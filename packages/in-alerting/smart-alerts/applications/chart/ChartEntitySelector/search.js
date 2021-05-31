/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  PER_AP,
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import {
  ScopeSelectorAppItem,
  ScopeSelectorServiceItem,
  ScopeSelectorEndpoint
} from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ScopeSelectorItem';
import React from 'react';

const evaluationTypeLevelMap = {
  [PER_AP]: 'APP',
  [PER_AP_SERVICE]: 'APP_SERVICE',
  [PER_AP_ENDPOINT]: 'APP_SERVICE_ENDPOINT'
};

export function getLevel(evaluationType) {
  return evaluationTypeLevelMap[evaluationType];
}

export function searchResultsToListItems(searchResult, evaluationType) {
  const items = searchResult?.items;
  if (!items) {
    return [];
  }

  if (evaluationType === PER_AP) {
    return items.map(({ applicationName, applicationId }) => ({
      type: 'APPLICATION',
      label: applicationName,
      path: <ScopeSelectorAppItem applicationName={applicationName} />,
      id: applicationId
    }));
  }

  if (evaluationType === PER_AP_SERVICE)
    return items.map(chain => {
      const { applicationName, serviceName, serviceId } = chain;

      return {
        type: 'SERVICE',
        label: serviceName,
        path: <ScopeSelectorServiceItem applicationName={applicationName} serviceName={serviceName} />,
        id: serviceId
      };
    });

  return items.map(chain => {
    const { applicationName, serviceName, endpointName, endpointId } = chain;

    return {
      type: 'ENDPOINT',
      label: endpointName,
      path: (
        <ScopeSelectorEndpoint
          applicationName={applicationName}
          serviceName={serviceName}
          endpointName={endpointName}
        />
      ),
      id: endpointId
    };
  });
}
