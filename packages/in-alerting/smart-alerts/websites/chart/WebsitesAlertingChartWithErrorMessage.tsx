/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { Spacer, Message } from '@instana/components';

import { useFetchAdaptiveBaselineOrUseFallbackFromEvent } from 'in-alerting/smart-alerts/websites/hooks/useFetchAdaptiveBaselineOrUseFallbackFromEvent';
import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import {
  CRITICAL_SEVERITY,
  extractBaselineForSeverity,
  WARNING_SEVERITY
} from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { AdaptiveBaselinePredictionData } from 'in-alerting/smart-alerts/data/adaptiveBaselinePredictionInfo';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { MetricName, getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { ChartViewConfigItem } from 'in-alerting/components/Chart/chartViewConfig';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t, Trans } from 'in-i18n';

interface WebsitesAlertingChartWithErrorMessageProps {
  viewConfig: ChartViewConfigItem;
  blueprintConfig: object;
  alertConfigWithFormModel: Omit<WebsiteSmartAlertConfigWithMetadata, 'tagFilterExpression'> & {
    tagFilterExpression: FormModelElement[];
  };
  eventBasedAdaptiveBaseline: Array<[string, AdaptiveBaselinePredictionData]>;
  isEventsView?: boolean;
  isAlertDetailView?: boolean;
  setMetricResultPrecision: () => void;
}

export default function WebsitesAlertingChartWithErrorMessage(props: WebsitesAlertingChartWithErrorMessageProps) {
  const {
    alertConfigWithFormModel: { threshold },
    eventBasedAdaptiveBaseline,
    isEventsView,
    isAlertDetailView,
    ...remainingProps
  } = props;

  // fetch persistent baseline?
  if (threshold?.type === ADAPTIVE_BASELINE && (isAlertDetailView || isEventsView)) {
    return <AlertingChartWithErrorMessageForAdaptiveBaseline {...props} />;
  }

  return (
    <ChartWithErrorMessageAndData
      {...remainingProps}
      isEventsView={isEventsView}
      isAlertDetailView={isAlertDetailView}
      alertConfigWithFormModel={props.alertConfigWithFormModel}
    />
  );
}

function AlertingChartWithErrorMessageForAdaptiveBaseline(props: WebsitesAlertingChartWithErrorMessageProps) {
  const { error, baseline } = useFetchAdaptiveBaselineOrUseFallbackFromEvent(props);
  const onlyCriticalThresholdDefined = props.alertConfigWithFormModel.rules[0].thresholds.WARNING === undefined;

  return (
    <>
      <ChartWithErrorMessageAndData
        {...props}
        eventBasedAdaptiveBaseline={extractBaselineForSeverity(
          baseline,
          onlyCriticalThresholdDefined ? CRITICAL_SEVERITY : WARNING_SEVERITY
        )}
      />
      {error && (
        <>
          <Spacer size="normal" />
          <Message type="warning" withIcon small fullInlineWidth>
            <Trans i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.adaptiveBaselineErrorMessageNotAvailable" />
          </Message>
        </>
      )}
    </>
  );
}

// TODO , this needs to be updated once EUM changes for multi-threshold becomes available.
interface ChartWithErrorMessageAndDataProps
  extends Omit<WebsitesAlertingChartWithErrorMessageProps, 'eventBasedAdaptiveBaseline'> {
  eventBasedAdaptiveBaseline?: [number, number][];
}

// Extracted, because it needs a memoization of the isQueryValid-method to avoid unneeded re-rendering
function ChartWithErrorMessageAndData(props: ChartWithErrorMessageAndDataProps) {
  const { alertConfigWithFormModel } = props;

  const { threshold, rule, websiteId } = alertConfigWithFormModel;
  const { metricName, alertType } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);

  const isAlertQueryValid = useMemo(() => {
    const { isQueryValid } = createBoundedAlertQueryBuilder(websiteId, beaconType, threshold.type);

    return createIsAlertQueryValid(isQueryValid);
  }, [websiteId, beaconType, threshold.type]);

  return (
    <AlertingChartWithErrorMessage
      {...props}
      getErrorMessage={(isValidDependingOnMode: boolean) => getErrorMessage(!isValidDependingOnMode)}
      queryValidator={isAlertQueryValid}
    />
  );
}

function getErrorMessage(queryError: boolean) {
  if (queryError) {
    return t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery');
  }
  return;
}
