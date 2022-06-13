/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';
import { just } from '@instana/observables';

import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { chartViewConfigPropType } from 'in-alerting/components/Chart/chartViewConfig';
import AlertingChart from 'in-alerting/components/Chart/AlertingChart';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function AlertingChartWithErrorMessage({
  getErrorMessage,
  customValidators,
  queryValidator,
  applicationId,
  serviceId,
  endpointId,
  alertConfigWithFormModel,
  blueprintConfig,
  viewConfig,
  ...remainingProps
}) {
  const { numeratorTagFilterFormModel, enrichedTagFilterFormModel } = getEnhancedTagFilterFormModel(
    alertConfigWithFormModel,
    blueprintConfig,
    applicationId,
    serviceId,
    endpointId
  );

  const queryValidationResult =
    useObservable(
      args => {
        if (queryValidator) return queryValidator(args);
        return just({ data: true });
      },
      [alertConfigWithFormModel.tagFilterExpression, viewConfig.timeConfig, queryValidator]
    ) ?? pendingResult;
  const isValid = Boolean(queryValidationResult?.data);

  const enrichedTagFilterExpression = useMemo(
    () => (isValid ? toBackendQueryModel(enrichedTagFilterFormModel) : null),
    [isValid, enrichedTagFilterFormModel]
  );

  // queryValidator returns undefined -> null -> true || false.
  // Show the error message only if the backend explicitly returns false
  const isValidDependingOnMode = queryValidationResult?.data !== false;

  const customValidationValid = customValidators?.(isValidDependingOnMode) ?? true;

  return isValidDependingOnMode && customValidationValid ? (
    <AlertingChart
      {...remainingProps}
      alertConfigWithFormModel={alertConfigWithFormModel}
      blueprintConfig={blueprintConfig}
      viewConfig={viewConfig}
      numeratorTagFilterExpression={toBackendQueryModel(numeratorTagFilterFormModel)}
      enrichedTagFilterExpression={enrichedTagFilterExpression}
    />
  ) : (
    <Message withIcon>
      {getErrorMessage?.(isValidDependingOnMode) ??
        t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery')}
    </Message>
  );
}

AlertingChartWithErrorMessage.propTypes = {
  viewConfig: chartViewConfigPropType.isRequired,
  alertConfigWithFormModel: PropTypes.object.isRequired,
  blueprintConfig: PropTypes.object.isRequired,
  /**
   * Optional applicationId, used
   * to scope down the metric in the chart to a single application config
   **/
  applicationId: PropTypes.string,
  /**
   * Optional serviceId
   * to scope down the metric in the chart to a single entity
   **/
  serviceId: PropTypes.string,
  /**
   * Optional endpointId
   * to scope down the metric in the chart to a single entity
   **/
  endpointId: PropTypes.string,
  alertsPreviewEnabled: PropTypes.bool,
  canReload: PropTypes.bool,
  isQB1only: PropTypes.bool,
  setMetricResultPrecision: PropTypes.func,
  /**
   * Optionally add a specific validation.
   * Called to verify if filters are valid.
   * function returning an observable: If the result is false, an error will be shown.
   * if not set, there will be no validation.
   */
  queryValidator: PropTypes.func,
  getErrorMessage: PropTypes.func,
  customValidators: PropTypes.func
};
