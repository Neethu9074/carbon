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
      getSubtitle={config => getSubtitle(config.rules[0])}
      getAdditionalContent={config => <BuiltInIndicator builtIn={config.builtIn} />}
    />
  );
}

export function getSubtitle(ruleWithThreshold) {
  const { alertType, aggregation, metricName } = ruleWithThreshold.rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricLabel = blueprintConfig.getMetricLabel(metricName);
  const formattedMetricLabel =
    alertType === 'slowness' ? `${metricLabel} (${getAggregationText(aggregation)})` : metricLabel;

  const { thresholdOperator, thresholds } = ruleWithThreshold;
  const { WARNING, CRITICAL } = thresholds || {};
  const type = WARNING?.type ?? CRITICAL?.type;
  if (type === STATIC_THRESHOLD) {
    const value = WARNING?.value ?? CRITICAL?.value;
    const metricFormat = blueprintConfig.getMetricFormat(metricName);
    const formattedValue = (metricFormat.short || metricFormat.compact)(value);
    const humanReadableOperator = humanReadableThresholdOperator(thresholdOperator);

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
    const seasonality = WARNING?.seasonality ?? CRITICAL?.seasonality;
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
    severity: PropTypes.number,
    rule: PropTypes.shape({
      alertType: PropTypes.string.isRequired,
      metricName: PropTypes.string.isRequired
    }),
    threshold: PropTypes.shape({
      operator: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.number
    }),
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        rule: PropTypes.shape({
          alertType: PropTypes.string.isRequired,
          metricName: PropTypes.string.isRequired
        }).isRequired,
        thresholdOperator: PropTypes.string.isRequired,
        thresholds: PropTypes.shape({
          CRITICAL: PropTypes.shape({
            type: PropTypes.string.isRequired,
            value: PropTypes.number
          }),
          WARNING: PropTypes.shape({
            type: PropTypes.string.isRequired,
            value: PropTypes.number
          })
        }).isRequired
      })
    ).isRequired,
    evaluationType: PropTypes.string.isRequired,
    builtIn: PropTypes.bool
  }).isRequired
};
