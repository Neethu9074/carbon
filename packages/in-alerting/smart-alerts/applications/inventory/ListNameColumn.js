/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ListColumns.mless';

export function ListNameColumn({ description, enabled, name, severity, rule }) {
  return (
    <HorizontalFlexWrapper>
      <SvgIcon
        className={classNames({
          [locals.alertIcon]: true,
          [locals.alertIconSeverityLow]: severity <= 5,
          [locals.alertIconSeverityHigh]: severity > 5
        })}
        type={enabled ? 'lib_alerts_alert' : 'lib_actions_pause'}
      />
      <div className={classNames(locals.column, locals.fullWidth)}>
        <Tooltip themeStyle="light" content={description} align="topMiddle" delay={500}>
          <div className={classNames(locals.name, locals.fullWidth)}>{name}</div>
        </Tooltip>
        <div className={locals.nameSubtext}>{getSubtitle(rule)}</div>
      </div>
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

ListNameColumn.propTypes = {
  description: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  severity: PropTypes.number.isRequired,
  rule: PropTypes.shape({
    alertType: PropTypes.string.isRequired,
    metricName: PropTypes.string.isRequired
  }).isRequired
};
