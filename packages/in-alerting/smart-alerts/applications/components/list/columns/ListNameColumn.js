/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon, Link } from '@instana/components';

import {
  alertsTab,
  alertsTabDetailsFullyQualified,
  applicationDashboard,
  globalAlertDetails
} from 'in-applications/navigation/paths';
import AlertTitleWithPlaceholderHighlighting from 'in-alerting/smart-alerts/applications/inventory/AlertTitleWithPlacholderHighlighting';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-applications/navigation/matrix';
import { STATIC_THRESHOLD, ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ListColumns.mless';

export function ListNameColumn({ config, configsCategory, additionalMatrixKeys = () => [], goToGlobalAlertDetails }) {
  const { description, enabled, name, severity, rule, threshold, id, created, builtIn, evaluationType } = config;

  return (
    <HorizontalFlexWrapper className={locals.nameListColumn}>
      <SvgIcon
        className={classNames({
          [locals.alertIcon]: true,
          [locals.alertIconSeverityLow]: severity <= 5,
          [locals.alertIconSeverityHigh]: severity > 5
        })}
        type={enabled ? 'lib_alerts_alert' : 'lib_actions_pause'}
      />
      <div className={locals.name}>
        <Tooltip content={description} align="topMiddle" delay={500}>
          <Link
            href$={getModifiedUrlStream(_location => {
              _location.pathname = goToGlobalAlertDetails ? globalAlertDetails : alertsTabDetailsFullyQualified;

              for (const { key, value } of additionalMatrixKeys({ configsCategory, config })) {
                setOrDeleteMatrixKey(_location, applicationDashboard, key, value);
              }

              setOrDeleteMatrixKey(_location, alertsTab, alertIdMatrixParam, id);
              setOrDeleteMatrixKey(_location, alertsTab, alertCreatedMatrixParam, created);

              return _location;
            })}
          >
            <AlertTitleWithPlaceholderHighlighting configName={name} evaluationType={evaluationType} />
          </Link>
        </Tooltip>
        <div className={locals.nameSubtext}>{getSubtitle(rule, threshold)}</div>
      </div>
      <BuiltInIndicator builtIn={builtIn} />
    </HorizontalFlexWrapper>
  );
}

function getSubtitle(rule, threshold) {
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
    id: PropTypes.string.isRequired,
    created: PropTypes.number.isRequired,
    builtIn: PropTypes.bool
  }).isRequired,
  configsCategory: PropTypes.string.isRequired,
  additionalMatrixKeys: PropTypes.func,
  goToGlobalAlertDetails: PropTypes.bool
};
