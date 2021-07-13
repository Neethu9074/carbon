/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import AlertTitleWithPlaceholderHighlighting from 'in-alerting/smart-alerts/applications/inventory/AlertTitleWithPlacholderHighlighting';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ListColumns.mless';

export function SimpleListNameColumn({ config }) {
  const { description, enabled, name, severity, rule, builtIn } = config;

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
          <div>
            <AlertTitleWithPlaceholderHighlighting configName={name} />
          </div>
        </Tooltip>
        <div className={locals.nameSubtext}>{getSubtitle(rule)}</div>
      </div>
      <BuiltInIndicator builtIn={builtIn} />
    </HorizontalFlexWrapper>
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
    id: PropTypes.string.isRequired,
    created: PropTypes.number.isRequired,
    builtIn: PropTypes.bool
  }).isRequired
};
