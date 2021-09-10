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
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { isLoading, hasError, errorWithData, success } from 'in-services/util/result';
import getApplication from 'in-applications/subscriptions/getApplication';
import { pendingResult } from 'in-services/fixedObjects';

export default function useApplicationsAndServicesSubscriptions({
  alertConfigWithFormModel,
  applicationIds,
  queryWindowSize
}) {
  const { applications, boundaryScope, tagFilterExpression, includeSynthetic } = alertConfigWithFormModel;

  // only pass the user-defined part of the query, because the generated part is valid anyways, and the validation
  // would reject the entity-filter anyways, because the user is not allowed to use them
  const isQueryValid = useIsTagFilterFormModelValid(tagFilterExpression);

  const fetchAppsAndServices = applicationIds.map(applicationId => {
    const scopeDownEnrichedTagFilterFormModel = joinExpressions({
      expressions: [
        getEnrichedFiltersForApplication(alertConfigWithFormModel, applicationId),
        getEntitySelectionAsTagFilterFormModel(applications, boundaryScope)
      ]
    });
    return combineLatest([
      getApplication({ id: applicationId }),
      isQueryValid
        ? getServiceList(queryWindowSize, scopeDownEnrichedTagFilterFormModel, includeSynthetic)
        : just(pendingResult)
    ]).map(([app, services]) => {
      if (isLoading(app) || isLoading(services)) return pendingResult;
      if (hasError(app) || hasError(services)) {
        return errorWithData([...app.errors, ...services.errors], {
          app: app.data,
          services: services.data?.items
        });
      }
      return success({
        app: app.data,
        services: services.data?.items
      });
    });
  });

  return useObservable(combineLatest(fetchAppsAndServices), [
    applications,
    isQueryValid,
    boundaryScope,
    includeSynthetic
  ]);
}
