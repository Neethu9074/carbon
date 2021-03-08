/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  getEnhancedTagFilterFormModel,
  getEnhancedTagFilters
} from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { isAlertQueryValid as isApplicationAlertQueryValid } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { chartViewConfigPropType } from 'in-alerting/components/Chart/chartViewConfig';
import { switchQB1orQB2Helper } from 'in-alerting/components/WithQB1orQB2';
import AlertingChart from 'in-alerting/components/Chart/AlertingChart';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import Message from 'in-new-components/Message';
import { t } from 'in-i18n';

export default function AlertingChartWithErrorMessage({
  getErrorMessage,
  customValidators,
  isAlertQueryValid = isApplicationAlertQueryValid,
  ...remainingProps
}) {
  const { alertConfigWithFormModel, blueprintConfig, viewConfig, subEntityId } = remainingProps;

  const { numeratorFilter, enrichedTagFilters, enrichedTagFilterFormModel } = switchQB1orQB2Helper(
    () => getEnhancedTagFilters(alertConfigWithFormModel, blueprintConfig, subEntityId),
    () => getEnhancedTagFilterFormModel(alertConfigWithFormModel, blueprintConfig, subEntityId),
    isQB2Config => isQB2Config(alertConfigWithFormModel.convertedTagFilterExpression)
  );

  const queryValidationResult =
    useObservable(args => isAlertQueryValid(args), [
      alertConfigWithFormModel.tagFilterExpression,
      viewConfig.timeConfig
    ]) ?? pendingResult;
  const isValid = Boolean(queryValidationResult?.data);

  const isValidDependingOnMode = switchQB1orQB2Helper(
    () => true,
    // isAlertQueryValid returns undefined -> null -> true || false.
    // Because of that we need this extra handling to ensure that we show the error message only if the backend
    // explicitly returns false
    () => queryValidationResult?.data !== false,
    isQB2Config => isQB2Config(Boolean(alertConfigWithFormModel.convertedTagFilterExpression))
  );

  const enrichedTagFilterExpression = useMemo(
    () => (isValid ? toBackendQueryModel(enrichedTagFilterFormModel) : null),
    [isValid, enrichedTagFilterFormModel]
  );

  const customValidationValid = customValidators?.(isValidDependingOnMode) ?? true;

  const errorMessage =
    getErrorMessage?.(isValidDependingOnMode) ??
    t('in-new-components:alerting.chart.alertingChartMessageInvalidFilterQuery');

  return isValidDependingOnMode && customValidationValid ? (
    <AlertingChart
      {...remainingProps}
      numeratorFilter={numeratorFilter}
      enrichedTagFilters={enrichedTagFilters}
      enrichedTagFilterExpression={enrichedTagFilterExpression}
    />
  ) : (
    <Message withIcon>{errorMessage}</Message>
  );
}

AlertingChartWithErrorMessage.propTypes = {
  viewConfig: chartViewConfigPropType.isRequired,
  alertConfigWithFormModel: PropTypes.object.isRequired,
  blueprintConfig: PropTypes.object.isRequired,
  /**
   * Optional sub-entity ID, such as serviceId or pageId,
   * to scope down the metric in the chart to a single entity
   **/
  subEntityId: PropTypes.string,
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
