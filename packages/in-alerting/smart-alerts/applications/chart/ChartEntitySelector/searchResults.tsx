/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Cursor, AlertEvaluationType, AppDataEntityChainItem } from '@instana/types';

import {
  ScopeSelectorAppItem,
  ScopeSelectorEndpoint,
  ScopeSelectorServiceItem
} from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ScopeSelectorItem';
import {
  PER_AP,
  PER_AP_ENDPOINT,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { State } from 'in-hooks/useCursorPagination';
import { t } from 'in-i18n';

const evaluationTypeLevelMap = {
  [PER_AP]: 'APP',
  [PER_AP_SERVICE]: 'APP_SERVICE',
  [PER_AP_ENDPOINT]: 'APP_SERVICE_ENDPOINT'
};

export function getLevel(evaluationType: AlertEvaluationType) {
  return evaluationTypeLevelMap[evaluationType];
}

const tooManyResultsItemOption = {
  path: t('in-alerting:smartAlerts.applications.chart.entitySelection.tooManyResults')
};

export function createApOnlyItem({
  applicationName,
  applicationId
}: {
  applicationName: string;
  applicationId: string;
}) {
  return {
    type: 'APPLICATION',
    label: applicationName,
    path: <ScopeSelectorAppItem applicationName={applicationName} />,
    id: applicationId
  };
}

export function searchResultList(items: AppDataEntityChainItem[], evaluationType: AlertEvaluationType) {
  if (evaluationType === PER_AP_SERVICE) {
    return items.map(({ appDataEntityChain }) => {
      const { applicationId, applicationName, serviceName, serviceId } = appDataEntityChain;

      return {
        type: 'SERVICE',
        label: serviceName,
        path: (
          <ScopeSelectorServiceItem
            applicationName={applicationName}
            serviceName={serviceName ?? valueMissingPlaceholder}
          />
        ),
        applicationId,
        id: serviceId
      };
    });
  }

  return items.map(({ appDataEntityChain }) => {
    const { applicationId, serviceId, applicationName, serviceName, endpointName, endpointId } = appDataEntityChain;

    return {
      type: 'ENDPOINT',
      label: endpointName,
      path: (
        <ScopeSelectorEndpoint
          applicationName={applicationName}
          serviceName={serviceName ?? valueMissingPlaceholder}
          endpointName={endpointName ?? valueMissingPlaceholder}
        />
      ),
      applicationId,
      serviceId,
      id: endpointId
    };
  });
}

export function searchResultsToListItems(
  searchResult: State<Cursor, AppDataEntityChainItem> | undefined,
  evaluationType: AlertEvaluationType
) {
  const items = searchResult?.items;
  if (!items) {
    return [];
  }

  const list = searchResultList(items, evaluationType);

  const canLoadMore = searchResult?.canLoadMore;
  if (canLoadMore) {
    return [...list, tooManyResultsItemOption];
  }
  return list;
}
