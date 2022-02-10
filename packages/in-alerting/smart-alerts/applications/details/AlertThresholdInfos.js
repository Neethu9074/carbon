/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import { applicationThresholdTypeOptions } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import alertEvaluationTypes from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/AlertConfiguration.mless';

export function AlertThresholdInfos({ threshold, rule, evaluationType }) {
  const { operator, type: thresholdType, seasonality, value } = threshold;

  const thresholdAndSeasonality = thresholdType + (seasonality ? '.' + seasonality : '');
  const thresholdTypeLabel = applicationThresholdTypeOptions.find(type => type.value === thresholdAndSeasonality)
    ?.label;

  const { alertType, aggregation } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const formattedMetricLabel = createFormattedMetricLabel(
    blueprintConfig,
    alertType,
    aggregation,
    thresholdType,
    value,
    operator
  );

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

function createFormattedMetricLabel(blueprintConfig, alertType, aggregation, thresholdType, value, operator) {
  let formattedMetricLabel = blueprintConfig.getMetricLabel();

  if (alertType === 'slowness') {
    formattedMetricLabel += ` (${getAggregationText(aggregation)})`;
  }

  if (thresholdType === STATIC_THRESHOLD) {
    const metricFormat = blueprintConfig.getMetricFormat();
    const formattedValue = metricFormat.compact(value);
    formattedMetricLabel += ` ${operator} ${formattedValue}`;
  }
  return formattedMetricLabel;
}
