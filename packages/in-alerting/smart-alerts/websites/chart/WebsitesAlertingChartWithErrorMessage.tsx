/*
 * (c) Copyright IBM Corp. 2025
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
  extractAlertConfigWithFormModel,
  getErrorMessage
} from 'in-alerting/smart-alerts/eum/utils/thresholdChartUtil';
import {
  MetricName,
  WebsitesAlertType,
  getBlueprintConfig
} from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { AdaptiveBaselinePredictionData } from 'in-alerting/smart-alerts/data/adaptiveBaselinePredictionInfo';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { ChartViewConfigItem } from 'in-alerting/components/Chart/chartViewConfig';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { Trans } from 'in-i18n';

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
  const { alertConfigWithFormModel, eventBasedAdaptiveBaseline, isEventsView, isAlertDetailView, ...remainingProps } =
    props;

  const { rules } = alertConfigWithFormModel;
  const thresholdType = (rules[0]?.thresholds?.WARNING ?? rules[0]?.thresholds?.CRITICAL)?.type;
  // fetch persistent baseline?
  if (thresholdType === ADAPTIVE_BASELINE && (isAlertDetailView || isEventsView)) {
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
  return (
    <>
      <ChartWithErrorMessageAndData {...props} eventBasedAdaptiveBaseline={baseline} />
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
  eventBasedAdaptiveBaseline?: [number, number, number][];
}

// Extracted, because it needs a memoization of the isQueryValid-method to avoid unneeded re-rendering
function ChartWithErrorMessageAndData(props: ChartWithErrorMessageAndDataProps) {
  const { alertConfigWithFormModel } = props;
  const { alertType, definedThresholdType, metricName } = extractAlertConfigWithFormModel(
    alertConfigWithFormModel.rules[0]
  );
  const { websiteId } = alertConfigWithFormModel;
  const blueprintConfig = getBlueprintConfig(alertType as WebsitesAlertType);
  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);

  const isAlertQueryValid = useMemo(() => {
    const { isQueryValid } = createBoundedAlertQueryBuilder(websiteId, beaconType, definedThresholdType);
    return createIsAlertQueryValid(isQueryValid);
  }, [websiteId, beaconType, definedThresholdType]);

  return (
    <AlertingChartWithErrorMessage
      {...props}
      isMultiThresholdEnabled
      getErrorMessage={(isValidDependingOnMode: boolean) => getErrorMessage(!isValidDependingOnMode)}
      queryValidator={isAlertQueryValid}
    />
  );
}
