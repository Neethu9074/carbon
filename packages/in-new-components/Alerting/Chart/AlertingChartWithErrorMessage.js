/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useMemo } from 'react';
import { t } from 'in-i18n';

import {
  getEnhancedTagFilterExpression,
  getEnhancedTagFilters
} from 'in-new-components/Alerting/utils/tagfilterEnrichmentUtil';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { isAlertQueryValid } from 'in-applications/alerting/components/AlertQueryBuilder';
import { switchQB1orQB2Helper } from 'in-new-components/Alerting/components/WithQB1orQB2';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import Message from 'in-new-components/Message';

export default function AlertingChartWithErrorMessage(props) {
  const { alertConfig, blueprintConfig, viewConfig } = props;

  const { numeratorFilter, enrichedTagFilters, enrichedTagFilterExpression } = switchQB1orQB2Helper(
    () => getEnhancedTagFilters(alertConfig, blueprintConfig),
    () => getEnhancedTagFilterExpression(alertConfig, blueprintConfig),
    isQB2Config => isQB2Config(alertConfig.convertedTagFilterExpression)
  );

  const queryValidationResult =
    useObservable(args => isAlertQueryValid(args), [alertConfig.tagFilterExpression, viewConfig.timeConfig]) ??
    pendingResult;

  const isValid = Boolean(queryValidationResult?.data);

  const isValidDependingOnMode = switchQB1orQB2Helper(
    () => true,
    // isAlertQueryValid returns undefined -> null -> true || false.
    // Because of that we need this extra handling to ensure that we show the error message only if the backend
    // explicitly returns false
    () => queryValidationResult?.data !== false,
    isQB2Config => isQB2Config(alertConfig.convertedTagFilterExpression)
  );

  const backendQueryModel = useMemo(() => (isValid ? toBackendQueryModel(enrichedTagFilterExpression) : null), [
    isValid,
    enrichedTagFilterExpression
  ]);

  return isValidDependingOnMode ? (
    <AlertingChart
      {...props}
      numeratorFilter={numeratorFilter}
      enrichedTagFilters={enrichedTagFilters}
      enrichedTagFilterExpression={backendQueryModel}
    />
  ) : (
    <Message withIcon>{t('in-new-components:alerting.chart.alertingChartMessageInvalidFilterQuery')}</Message>
  );
}
