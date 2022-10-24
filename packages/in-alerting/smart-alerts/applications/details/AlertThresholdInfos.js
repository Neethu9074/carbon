/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import { applicationThresholdTypeOptions } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import alertEvaluationTypes from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/AlertConfiguration.mless';

export function AlertThresholdInfos({ threshold, rule, evaluationType }) {
  const { operator, type: thresholdType, seasonality, value } = threshold;
  const { alertType, aggregation, metricName } = rule;

  const thresholdAndSeasonality = thresholdType + (seasonality ? '.' + seasonality : '');
  const thresholdTypeLabel = applicationThresholdTypeOptions.find(type => type.value === thresholdAndSeasonality)
    ?.label;

  const formattedMetricLabel = createMetricLabel(alertType, aggregation, thresholdType, value, operator, metricName);
  const entityLabel = alertEvaluationTypes[evaluationType]?.shortText;

  return (
    <div className={locals.tilesRow}>
      <div className={locals.tile}>
        <KeyValue
          label={t('in-alerting:smartAlerts.details.thresholdTypeTitle')}
          value={thresholdTypeLabel}
          className={locals.keyValueExtraGap}
          multilineLabel
        />
      </div>
      <div className={locals.tile}>
        <KeyValue
          label={t('in-alerting:smartAlerts.details.metricTitle')}
          value={formattedMetricLabel}
          className={locals.keyValueExtraGap}
          multilineLabel
        />
      </div>
      <div className={locals.tile}>
        <KeyValue
          label={t('in-alerting:smartAlerts.details.entityTitle')}
          value={entityLabel}
          className={locals.keyValueExtraGap}
          multilineLabel
        />
      </div>
    </div>
  );
}

export function createMetricLabel(alertType, aggregation, thresholdType, value, operator, metricName) {
  const blueprintConfig = getBlueprintConfig(alertType);

  let formattedMetricLabel = blueprintConfig.getMetricLabel(metricName);

  if (alertType === 'slowness') {
    formattedMetricLabel += ` (${getAggregationText(aggregation)})`;
  }

  if (thresholdType === STATIC_THRESHOLD) {
    const metricFormat = blueprintConfig.getMetricFormat(metricName);
    const formattedValue = (metricFormat.short || metricFormat.compact)(value);
    const humanReadableOperator = humanReadableThresholdOperator(operator);

    formattedMetricLabel += ` ${humanReadableOperator} ${formattedValue}`;
  }

  return formattedMetricLabel;
}
