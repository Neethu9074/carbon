/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import React, { useEffect } from 'react';

import useIsTagFilterFormModelValid from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelValid';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import getServices from 'in-subscription/application/getServices';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

/*
 * @param applicationId
 * @param serviceId
 * @param setServiceId () -> returns the selected service
 */
export default function ChartSubEntitySelection({
  className,
  applicationId,
  serviceId,
  setServiceId,
  alertConfigWithFormModel,
  queryWindowSize
}) {
  const { isQueryValid, enrichedTagFilterFormModel } = getEnrichedFilters(alertConfigWithFormModel, applicationId);
  const result =
    useServiceList(
      queryWindowSize,
      isQueryValid,
      alertConfigWithFormModel.tagFilterExpression,
      enrichedTagFilterFormModel
    ) ?? pendingResult;

  const options = result.data?.items?.map(({ service }) => ({ label: service.label, value: service.id }));
  useEffect(() => {
    if (options) {
      if (!serviceId && options.length > 0) {
        // select first option by default
        setServiceId(options[0].value);
      } else if (serviceId && !options.some(option => option.value === serviceId)) {
        // unset selection if the current one is out of scope
        setServiceId(null);
      }
    }
  }, [options, serviceId]);

  const loadingOptions = [{ label: t('in-alerting:smartAlerts.components.smartAlertDialog.Loading') }];
  return (
    <ComboBox
      disabled={hasError(result) || isLoading(result)}
      className={className}
      value={serviceId}
      options={isLoading(result) ? loadingOptions : options}
      optionRenderer={option => option.label}
      onChange={selection => setServiceId(selection?.value)}
      placeholder={
        isLoading(result)
          ? t('in-alerting:smartAlerts.components.smartAlertDialog.LoadingServices')
          : t('in-alerting:smartAlerts.components.smartAlertDialog.NoServiceInScope')
      }
      clearable={false}
      autoComplete
      searchable
    />
  );
}

function getEnrichedFilters(alertConfigWithFormModel, applicationId, serviceId) {
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  return {
    enrichedTagFilterFormModel: joinExpressions({
      expressions: [
        // don't define the subEntityId to get the results of all services in scope
        blueprintConfig.getEntityTagFilterFormModel(alertConfigWithFormModel, applicationId, null, serviceId),
        // only use the user-defined filters, but not the rule-specific filters, to not exclude services that might not
        // match any call at the moment, but could do so in the future. Thus the user should be able to select them.
        alertConfigWithFormModel.tagFilterExpression
      ]
    }),
    // only pass the user-defined part of the query, because the generated part is valid anyways, and the validation
    // would reject the entity-filter anyways, because the user is not allowed to use them
    isQueryValid: useIsTagFilterFormModelValid(alertConfigWithFormModel.tagFilterExpression)
  };
}

function useServiceList(queryWindowSize, isQueryValid, tagFilterFormModel, enrichedTagFilterFormModel) {
  return useObservable(
    ([queryWindowSize, isQueryValid]) => {
      if (!isQueryValid) {
        return just(pendingResult);
      }

      return getServices({
        pagination: {
          page: 1,
          pageSize: 100
        },
        order: {
          by: 'serviceLabel',
          direction: 'ASC'
        },
        metrics: {},
        filter: {
          timeConfig: {
            windowSize: queryWindowSize
          }
        },
        tagFilterExpression: enrichedTagFilterFormModel && toBackendQueryModel(enrichedTagFilterFormModel),
        contextScope: 'NONE'
      });
    },
    [queryWindowSize, isQueryValid, tagFilterFormModel]
  );
}
