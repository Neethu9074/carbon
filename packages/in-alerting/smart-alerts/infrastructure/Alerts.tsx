/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { InfraAlertConfigWithMetadata, ThresholdConfigUnion, InfraAlertRuleUnion } from '@instana/types';

// eslint-disable-next-line no-restricted-imports
import {
  infraAlertsDetailsPath,
  infraAlertDetailsFullyQualifiedPath,
  infraSmartAlerts
} from 'in-stores/navigation/paths/mainPaths';
// eslint-disable-next-line no-restricted-imports
import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-infrastructure/navigation/matrix';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { getAllAlertConfigsWithResult } from 'in-alerting/smart-alerts/infrastructure/api/infrastructureAlertConfig';
import { actionHandlers } from 'in-alerting/smart-alerts/infrastructure/lists/ListActionHandlers';
// @ts-ignore-error
import { getMetricDefinition } from 'in-sdk/metrics/metricDefinitions';
import { sortOptions } from 'in-alerting/smart-alerts/infrastructure/lists/constants';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { infraSmartAlertsDetailsPageEnabled } from 'in-services/featureFlags';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';
import { getPluginName } from 'in-sdk/pluginName';
import WithIcon from 'in-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function Alerts() {
  const handlers = role?.canConfigureCustomAlerts ? actionHandlers : {};
  return (
    <>
      <AlertBaseList<InfraAlertConfigWithMetadata>
        extraColumnDefinitions={getColumnDefinitions()}
        actionHandlers={handlers}
        getAlertConfigs={() => getAllAlertConfigsWithResult()}
        createRowLinkLocation={infraSmartAlertsDetailsPageEnabled ? createRowLinkLocation : undefined}
        getSubtitle={config => getSubtitle(config.rule, config.threshold)}
        sortOptions={sortOptions}
        alertsTab={infraSmartAlerts}
      />
    </>
  );
}

function getColumnDefinitions() {
  return [
    {
      id: 'entityType',
      label: '', // not relevant because we don't show the column header according to our designs
      getContent: (config: InfraAlertConfigWithMetadata) => {
        const {
          rule: { entityType }
        } = config;
        if (entityType === 'any') {
          return '';
        }
        return (
          <Tooltip content={getPluginName(entityType, 1)} align="topLeft" delay={500}>
            <WithIcon plugin={entityType} iconColor={theme.lib.colors.N700Medium}>
              {getPluginName(entityType, 1)}
            </WithIcon>
          </Tooltip>
        );
      }
    }
  ];
}

function getSubtitle(rule: InfraAlertRuleUnion, threshold: ThresholdConfigUnion & { value?: number }) {
  const { type, operator, value } = threshold;
  const { entityType, metricName } = rule;

  if (type === STATIC_THRESHOLD) {
    const humanReadableOperator = humanReadableThresholdOperator(operator);
    const metricDefinition = getMetricDefinition(entityType, metricName);

    return t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitleForStaticThreshold', {
      metricName: metricDefinition.getLabel(),
      operator: humanReadableOperator,
      value
    });
  }

  throw new Error('Not yet supported threshold type: ' + type);
}

function createRowLinkLocation(config: InfraAlertConfigWithMetadata, location: Location): Location {
  const rowLinkLocation = {
    ...location,
    pathname: infraAlertDetailsFullyQualifiedPath
  };

  setOrDeleteMatrixKey(rowLinkLocation, infraAlertsDetailsPath, alertIdMatrixParam, config.id);
  setOrDeleteMatrixKey(rowLinkLocation, infraAlertsDetailsPath, alertCreatedMatrixParam, config.created);
  return rowLinkLocation;
}
