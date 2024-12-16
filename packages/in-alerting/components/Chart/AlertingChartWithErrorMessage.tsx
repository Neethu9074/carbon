/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Dispatch, SetStateAction, useMemo } from 'react';

import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';
import { Result } from '@instana/types';

import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
//@ts-expect-error TS migration
import AlertingChart from 'in-alerting/components/Chart/AlertingChart';
import { QueryValidatorType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { ChartViewConfigItem } from 'in-alerting/components/Chart/chartViewConfig';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface AlertingChartWithErrorMessageProps<AlertConfig extends Object> {
  viewConfig: ChartViewConfigItem;
  alertConfigWithFormModel: AlertConfig & { tagFilterExpression: FormModelElement[] };
  blueprintConfig: object;
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
  alertsPreviewEnabled?: boolean;
  canReload?: boolean;
  setMetricResultPrecision?: Dispatch<SetStateAction<string>>;
  queryValidator?: QueryValidatorType;
  getErrorMessage: (args: boolean) => string | undefined;
  customValidators?: (args: boolean) => boolean;
  isTearSheet?: boolean;
  isMultiThresholdEnabled?: boolean;
  eventSeverity?: number;
  isEventsView?: boolean;
}
export default function AlertingChartWithErrorMessage<AlertConfig extends Object>({
  getErrorMessage,
  customValidators,
  queryValidator,
  applicationId,
  serviceId,
  endpointId,
  alertConfigWithFormModel,
  blueprintConfig,
  viewConfig,
  isMultiThresholdEnabled = false,
  ...remainingProps
}: AlertingChartWithErrorMessageProps<AlertConfig>) {
  const queryValidationResult: Result<boolean> =
    useObservable(() => {
      if (queryValidator) return queryValidator([alertConfigWithFormModel.tagFilterExpression, viewConfig.timeConfig]);
      return successObservable(true);
    }, [alertConfigWithFormModel.tagFilterExpression, viewConfig.timeConfig, queryValidator]) ?? pendingResult;

  const isValid = Boolean(queryValidationResult?.data);

  const [numeratorTagFilterExpression, enrichedTagFilterExpression] = useMemo(() => {
    if (!isValid) {
      return [null, null];
    }
    const { numeratorTagFilterFormModel, enrichedTagFilterFormModel } = getEnhancedTagFilterFormModel(
      alertConfigWithFormModel,
      blueprintConfig,
      applicationId,
      serviceId,
      endpointId
    );
    return [toBackendQueryModel(numeratorTagFilterFormModel), toBackendQueryModel(enrichedTagFilterFormModel)];
  }, [isValid, alertConfigWithFormModel, blueprintConfig, applicationId, serviceId, endpointId]);

  // queryValidator returns undefined -> null -> true || false.
  // Show the error message only if the backend explicitly returns false
  const isValidDependingOnMode = queryValidationResult?.data !== false;

  const customValidationValid = customValidators?.(isValidDependingOnMode) ?? true;
  const { isEventsView, eventSeverity } = remainingProps;

  return isValidDependingOnMode && customValidationValid ? (
    <AlertingChart
      {...remainingProps}
      alertConfigWithFormModel={alertConfigWithFormModel}
      blueprintConfig={blueprintConfig}
      viewConfig={viewConfig}
      numeratorTagFilterExpression={numeratorTagFilterExpression}
      enrichedTagFilterExpression={enrichedTagFilterExpression}
      isMultiThresholdEnabled={isMultiThresholdEnabled}
      isEventsView={isEventsView}
      eventSeverity={eventSeverity}
    />
  ) : (
    <Message withIcon fullInlineWidth>
      {getErrorMessage?.(isValidDependingOnMode) ??
        t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery')}
    </Message>
  );
}
