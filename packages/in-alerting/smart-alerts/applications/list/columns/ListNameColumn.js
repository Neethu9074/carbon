/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import getAlertTitleWithPlaceholderHighlighting from 'in-alerting/smart-alerts/applications/inventory/getAlertTitleWithPlaceholderHighlighting';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { STATIC_THRESHOLD, ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export function ListNameColumn({ config }) {
  return (
    <NameColumnCell
      config={config}
      renderName={config =>
        getAlertTitleWithPlaceholderHighlighting({ configName: config.name, evaluationType: config.evaluationType })
      }
      getSubtitle={config => getSubtitle(config.rule, config.threshold)}
      getAdditionalContent={config => <BuiltInIndicator builtIn={config.builtIn} />}
    />
  );
}

export function getSubtitle(rule, threshold) {
  const { alertType, aggregation, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricLabel = blueprintConfig.getMetricLabel(metricName);
  const formattedMetricLabel =
    alertType === 'slowness' ? `${metricLabel} (${getAggregationText(aggregation)})` : metricLabel;

  const { operator, seasonality, type, value } = threshold;
  if (type === STATIC_THRESHOLD) {
    const metricFormat = blueprintConfig.getMetricFormat(metricName);
    const formattedValue = (metricFormat.short || metricFormat.compact)(value);
    const humanReadableOperator = humanReadableThresholdOperator(operator);

    return t('in-alerting:smartAlerts.applications.inventory.getSubtitleForStaticThreshold', {
      metricLabel: formattedMetricLabel,
      operator: humanReadableOperator,
      value: formattedValue
    });
  }

  if (type === ADAPTIVE_BASELINE) {
    return t('in-alerting:smartAlerts.applications.inventory.getSubtitleForAdaptiveThreshold', {
      metricLabel: formattedMetricLabel
    });
  }

  if (type === HISTORIC_BASELINE) {
    if (seasonality === DAILY) {
      return t('in-alerting:smartAlerts.applications.inventory.getSubtitleForStaticDailySeasonality', {
        metricLabel: formattedMetricLabel,
        aggregation: getAggregationText(aggregation)
      });
    }

    return t('in-alerting:smartAlerts.applications.inventory.getSubtitleForStaticWeeklySeasonality', {
      metricLabel: formattedMetricLabel,
      aggregation: getAggregationText(aggregation)
    });
  }

  // Simple fallback, should not be needed, except when there was no type
  return t('in-alerting:smartAlerts.applications.inventory.getSubtitle', {
    blueprintConfigName: blueprintConfig.name,
    metricLabel: formattedMetricLabel
  });
}

ListNameColumn.propTypes = {
  config: PropTypes.shape({
    description: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    severity: PropTypes.number.isRequired,
    rule: PropTypes.shape({
      alertType: PropTypes.string.isRequired,
      metricName: PropTypes.string.isRequired
    }).isRequired,
    threshold: PropTypes.shape({
      operator: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.number
    }).isRequired,
    evaluationType: PropTypes.string.isRequired,
    builtIn: PropTypes.bool
  }).isRequired
};
