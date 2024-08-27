/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  ApplicationSmartAlertConfigWithMetadata,
  GlobalApplicationsSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import getAlertTitleWithPlaceholderHighlighting from 'in-alerting/smart-alerts/applications/inventory/getAlertTitleWithPlaceholderHighlighting';
import { MetricName, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import { ApplicationAlertRuleUnion } from 'in-types';
import { t } from 'in-i18n';

interface SimpleListNameColumnProps {
  config: ApplicationSmartAlertConfigWithMetadata | GlobalApplicationsSmartAlertConfigWithMetadata;
}
export function SimpleListNameColumn({ config }: SimpleListNameColumnProps) {
  return (
    <NameColumnCell
      config={config}
      renderName={config =>
        getAlertTitleWithPlaceholderHighlighting({ configName: config.name, evaluationType: config.evaluationType })
      }
      getSubtitle={config => getSubtitle(config.rule)}
      getAdditionalContent={config => <BuiltInIndicator builtIn={'builtIn' in config ? config.builtIn : undefined} />}
    />
  );
}

function getSubtitle(rule: ApplicationAlertRuleUnion) {
  const alertType = rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricLabel = blueprintConfig.getMetricLabel(rule.metricName as MetricName);
  return t('in-alerting:smartAlerts.applications.inventory.getSubtitle', {
    blueprintConfigName: blueprintConfig.name,
    metricLabel: metricLabel
  });
}
