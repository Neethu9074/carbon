/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Dispatch, SetStateAction, useMemo } from 'react';

import { Message, Spacer } from '@instana/components';

import { useFetchAdaptiveBaselineOrUseFallbackFromEvent } from 'in-alerting/smart-alerts/mobileApp/hooks/useFetchAdaptiveBaselineOrUseFallbackFromEvent';
import {
  CRITICAL_SEVERITY,
  extractBaselineForSeverity,
  WARNING_SEVERITY
} from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { BluePrint, MetricName, getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { MobileAppSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { AdaptiveBaselinePredictionData } from 'in-alerting/smart-alerts/data/adaptiveBaselinePredictionInfo';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { ChartViewConfigItem } from 'in-alerting/components/Chart/chartViewConfig';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t, Trans } from 'in-i18n';

interface MobileAppAlertingChartWithErrorMessageProps {
  alertConfigWithFormModel: Omit<MobileAppSmartAlertConfigWithMetadata, 'tagFilterExpression'> & {
    tagFilterExpression: FormModelElement[];
  };
  viewConfig: ChartViewConfigItem;
  blueprintConfig: BluePrint;
  isAlertDetailView?: boolean;
  isEventsView?: boolean;
  setMetricResultPrecision?: Dispatch<SetStateAction<string>>;
  eventBasedAdaptiveBaseline: Array<[string, AdaptiveBaselinePredictionData]>;
  canReload?: boolean;
  alertsPreviewEnabled?: boolean;
}

// Extracted, because it needs a memoization of the isQueryValid-method to avoid unneeded re-rendering
export default function MobileAppAlertingChartWithErrorMessage(
  props: MobileAppAlertingChartWithErrorMessageProps
): JSX.Element {
  const {
    alertConfigWithFormModel: { threshold },
    eventBasedAdaptiveBaseline,
    isEventsView,
    isAlertDetailView,
    ...remainingProps
  } = props;

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

function AlertingChartWithErrorMessageForAdaptiveBaseline(
  props: MobileAppAlertingChartWithErrorMessageProps
): JSX.Element {
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
  extends Omit<MobileAppAlertingChartWithErrorMessageProps, 'eventBasedAdaptiveBaseline'> {
  eventBasedAdaptiveBaseline?: [number, number][];
}

function ChartWithErrorMessageAndData(props: ChartWithErrorMessageAndDataProps): JSX.Element {
  const { alertConfigWithFormModel } = props;
  const { threshold, rule, mobileAppId } = alertConfigWithFormModel;
  const { metricName, alertType } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);

  const isAlertQueryValid = useMemo(() => {
    const { isQueryValid } = createBoundedAlertQueryBuilder(mobileAppId, beaconType, threshold.type);

    return createIsAlertQueryValid(isQueryValid);
  }, [mobileAppId, beaconType, threshold.type]);

  return (
    <AlertingChartWithErrorMessage
      {...props}
      getErrorMessage={isValidDependingOnMode => getErrorMessage(!isValidDependingOnMode)}
      queryValidator={isAlertQueryValid}
    />
  );
}

function getErrorMessage(isQB2Error: boolean): string | undefined {
  if (isQB2Error) {
    return t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery');
  }
  return;
}
