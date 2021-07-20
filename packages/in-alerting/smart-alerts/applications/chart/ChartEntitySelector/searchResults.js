/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  ScopeSelectorAppItem,
  ScopeSelectorServiceItem,
  ScopeSelectorEndpoint
} from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ScopeSelectorItem';
import {
  PER_AP,
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { t } from 'in-i18n';

const evaluationTypeLevelMap = {
  [PER_AP]: 'APP',
  [PER_AP_SERVICE]: 'APP_SERVICE',
  [PER_AP_ENDPOINT]: 'APP_SERVICE_ENDPOINT'
};

export function getLevel(evaluationType) {
  return evaluationTypeLevelMap[evaluationType];
}

const tooManyResultsItemOption = {
  path: t('in-alerting:smartAlerts.applications.chart.entitySelection.tooManyResults')
};

export function createApOnlyItem({ applicationName, applicationId }) {
  return {
    type: 'APPLICATION',
    label: applicationName,
    path: <ScopeSelectorAppItem applicationName={applicationName} />,
    id: applicationId
  };
}

export function searchResultsToListItems(searchResult, evaluationType) {
  const items = searchResult?.items;
  if (!items) {
    return [];
  }

  const canLoadMore = searchResult?.canLoadMore;
  if (evaluationType === PER_AP_SERVICE) {
    const list = items.map(({ appDataEntityChain }) => {
      const { applicationName, serviceName, serviceId } = appDataEntityChain;

      return {
        type: 'SERVICE',
        label: serviceName,
        path: <ScopeSelectorServiceItem applicationName={applicationName} serviceName={serviceName} />,
        id: serviceId
      };
    });
    if (canLoadMore) {
      return [...list, tooManyResultsItemOption];
    }
    return list;
  }

  const list = items.map(({ appDataEntityChain }) => {
    const { applicationName, serviceName, endpointName, endpointId } = appDataEntityChain;

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
  if (canLoadMore) {
    return [...list, tooManyResultsItemOption];
  }
  return list;
}
