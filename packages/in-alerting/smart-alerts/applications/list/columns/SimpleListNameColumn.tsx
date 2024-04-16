/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertTitleWithPlaceholderHighlighting from 'in-alerting/smart-alerts/applications/inventory/AlertTitleWithPlacholderHighlighting';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import { t } from 'in-i18n';

export function SimpleListNameColumn({ config }) {
  return (
    <NameColumnCell
      config={config}
      renderName={config => (
        <AlertTitleWithPlaceholderHighlighting configName={config.name} evaluationType={config.evaluationType} />
      )}
      getSubtitle={config => getSubtitle(config.rule)}
      getAdditionalContent={config => <BuiltInIndicator builtIn={config.builtIn} />}
    />
  );
}

function getSubtitle(rule) {
  const alertType = rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricLabel = blueprintConfig.getMetricLabel(rule.metricName);
  return t('in-alerting:smartAlerts.applications.inventory.getSubtitle', {
    blueprintConfigName: blueprintConfig.name,
    metricLabel: metricLabel
  });
}

SimpleListNameColumn.propTypes = {
  config: PropTypes.shape({
    description: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    severity: PropTypes.number.isRequired,
    rule: PropTypes.shape({
      alertType: PropTypes.string.isRequired,
      metricName: PropTypes.string.isRequired
    }).isRequired,
    evaluationType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    created: PropTypes.number.isRequired,
    builtIn: PropTypes.bool
  }).isRequired
};
