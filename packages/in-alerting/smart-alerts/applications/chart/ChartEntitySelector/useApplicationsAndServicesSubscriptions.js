/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  getEnrichedFiltersForApplication,
  getServiceList
} from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/selectionApi';
import useIsTagFilterFormModelValid from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelValid';
import { getEntitySelectionAsTagFilterFormModel } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { pendingResult } from 'in-services/fixedObjects';

export default function useApplicationsAndServicesSubscriptions({
  alertConfigWithFormModel,
  applicationIds,
  queryWindowSize
}) {
  const { applications, boundaryScope, tagFilterExpression, includeSynthetic, rules } = alertConfigWithFormModel;

  const { isQueryValid } = getQueryBuilderForAlertType(rules[0].rule.alertType, rules[0].thresholds.WARNING?.type);

  // only pass the user-defined part of the query, because the generated part is valid anyway, and the validation
  // would reject the entity-filter anyway, because the user is not allowed to use them
  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(tagFilterExpression, isQueryValid);

  function scopedDownTagFilterExpression(applicationId) {
    return joinExpressions({
      expressions: [
        getEnrichedFiltersForApplication(alertConfigWithFormModel, applicationId),
        getEntitySelectionAsTagFilterFormModel(applications, boundaryScope, applicationId)
      ]
    });
  }

  const getServiceListIfValid = applicationId => {
    return isTagFilterFormModelValid
      ? getServiceList(queryWindowSize, scopedDownTagFilterExpression(applicationId), includeSynthetic)
      : just(pendingResult);
  };

  const fetchAppsOnly = applicationIds.map(applicationId =>
    getApplication({ id: applicationId }).map(result => ({
      ...result,
      data: {
        app: result.data,
        services: () => getServiceListIfValid(applicationId)
      }
    }))
  );

  const fetchAppsServices = applicationIds.map(applicationId =>
    getServiceListIfValid(applicationId).map(result => ({
      ...result,
      data: {
        app: {
          id: applicationId
        },
        services: result?.data?.items ?? []
      }
    }))
  );

  const isOnlyOneAP = applicationIds.length === 1;

  return useObservable(isTagFilterFormModelValid && combineLatest(isOnlyOneAP ? fetchAppsServices : fetchAppsOnly), [
    isTagFilterFormModelValid,
    applications,
    isQueryValid,
    boundaryScope,
    includeSynthetic
  ]);
}
