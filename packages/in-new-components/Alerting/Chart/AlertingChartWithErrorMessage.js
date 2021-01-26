/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';

import {
  getEnhancedTagFilterFormModel,
  getEnhancedTagFilters
} from 'in-new-components/Alerting/utils/tagfilterEnrichmentUtil';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { chartViewConfigPropType } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { isAlertQueryValid } from 'in-applications/alerting/components/AlertQueryBuilder';
import { switchQB1orQB2Helper } from 'in-new-components/Alerting/components/WithQB1orQB2';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import Message from 'in-new-components/Message';

export default function AlertingChartWithErrorMessage(props) {
  const { alertConfigWithFormModel, blueprintConfig, viewConfig, subEntityId } = props;

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
    isQB2Config => isQB2Config(alertConfigWithFormModel.convertedTagFilterExpression)
  );

  const enrichedTagFilterExpression = useMemo(
    () => (isValid ? toBackendQueryModel(enrichedTagFilterFormModel) : null),
    [isValid, enrichedTagFilterFormModel]
  );

  return isValidDependingOnMode ? (
    <AlertingChart
      {...props}
      numeratorFilter={numeratorFilter}
      enrichedTagFilters={enrichedTagFilters}
      enrichedTagFilterExpression={enrichedTagFilterExpression}
    />
  ) : (
    <Message withIcon>{t('in-new-components:alerting.chart.alertingChartMessageInvalidFilterQuery')}</Message>
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
  isQB1only: PropTypes.bool
};
