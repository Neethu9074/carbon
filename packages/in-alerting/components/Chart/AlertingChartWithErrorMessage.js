/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';

import { isAlertQueryValid as isApplicationAlertQueryValid } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { chartViewConfigPropType } from 'in-alerting/components/Chart/chartViewConfig';
import AlertingChart from 'in-alerting/components/Chart/AlertingChart';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function AlertingChartWithErrorMessage({
  getErrorMessage,
  customValidators,
  isAlertQueryValid = isApplicationAlertQueryValid,
  applicationId,
  serviceId,
  endpointId,
  ...remainingProps
}) {
  const { alertConfigWithFormModel, blueprintConfig, viewConfig } = remainingProps;

  const { numeratorFilter, enrichedTagFilterFormModel } = getEnhancedTagFilterFormModel(
    alertConfigWithFormModel,
    blueprintConfig,
    applicationId,
    serviceId,
    endpointId
  );

  const queryValidationResult =
    useObservable(args => isAlertQueryValid(args), [
      alertConfigWithFormModel.tagFilterExpression,
      viewConfig.timeConfig
    ]) ?? pendingResult;
  const isValid = Boolean(queryValidationResult?.data);

  // isAlertQueryValid returns undefined -> null -> true || false.
  // Because of that we need this extra handling to ensure that we show the error message only if the backend
  // explicitly returns false
  const isValidDependingOnMode = queryValidationResult?.data !== false;

  const enrichedTagFilterExpression = useMemo(
    () => (isValid ? toBackendQueryModel(enrichedTagFilterFormModel) : null),
    [isValid, enrichedTagFilterFormModel]
  );

  const customValidationValid = customValidators?.(isValidDependingOnMode) ?? true;

  return isValidDependingOnMode && customValidationValid ? (
    <AlertingChart
      {...remainingProps}
      numeratorFilter={numeratorFilter}
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
  /**
   * Optionally override default, application-specific validation.
   * Called to verify if filters are valid
   * If the result is false, an error will be shown
   */
  isAlertQueryValid: PropTypes.func,
  getErrorMessage: PropTypes.func,
  customValidators: PropTypes.func
};
