/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import {
  alertsTab,
  alertsTabDetailsFullyQualified,
  applicationDashboard,
  globalAlertDetails
} from 'in-applications/navigation/paths';
import AlertTitleWithPlaceholderHighlighting from 'in-alerting/smart-alerts/applications/inventory/AlertTitleWithPlacholderHighlighting';
import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-applications/navigation/matrix';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ListColumns.mless';

export function ListNameColumn({ config, configsCategory, additionalMatrixKeys = () => [], goToGlobalAlertDetails }) {
  const { description, enabled, name, severity, rule, id, created, builtIn } = config;

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
            <AlertTitleWithPlaceholderHighlighting configName={name} />
          </Link>
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
    id: PropTypes.string.isRequired,
    created: PropTypes.number.isRequired,
    builtIn: PropTypes.bool
  }).isRequired,
  configsCategory: PropTypes.string.isRequired,
  additionalMatrixKeys: PropTypes.func,
  goToGlobalAlertDetails: PropTypes.bool
};
