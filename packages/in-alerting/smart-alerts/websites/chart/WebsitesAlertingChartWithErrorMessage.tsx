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
  isEventsView?: boolean;
  isAlertDetailView?: boolean;
  setMetricResultPrecision: () => void;
  eventBasedAdaptiveBaseline: [number, number][];
}

export default function WebsitesAlertingChartWithErrorMessage(props: WebsitesAlertingChartWithErrorMessageProps) {
  const {
    alertConfigWithFormModel: { threshold },
    isEventsView,
    isAlertDetailView
  } = props;

  // fetch persistent baseline?
  if (threshold?.type === ADAPTIVE_BASELINE && (isAlertDetailView || isEventsView)) {
    return <AlertingChartWithErrorMessageForAdaptiveBaseline {...props} />;
  }

  return <ChartWithErrorMessageAndData {...props} />;
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

// Extracted, because it needs a memoization of the isQueryValid-method to avoid unneeded re-rendering
function ChartWithErrorMessageAndData(props: WebsitesAlertingChartWithErrorMessageProps) {
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
