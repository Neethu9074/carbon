/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ThresholdConfigUnion, InfraAlertRuleUnion, ForecastingConfig } from '@instana/types';

import {
  infraAlertsDetailsPath,
  infraAlertDetailsFullyQualifiedPath,
  infraSmartAlerts
} from 'in-stores/navigation/paths/mainPaths';
import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-infrastructure/navigation/matrix';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { getAllAlertConfigsWithResult } from 'in-alerting/smart-alerts/infrastructure/api/infrastructureAlertConfig';
import { replaceTitlePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/infrastructure/data/titlePlaceholders';
import { actionHandlers } from 'in-alerting/smart-alerts/infrastructure/lists/ListActionHandlers';
import { MetricLabel } from 'in-alerting/smart-alerts/infrastructure/lists/MetricLabel';
import { sortOptions } from 'in-alerting/smart-alerts/infrastructure/lists/constants';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import ScopeColumn from 'in-alerting/smart-alerts/infrastructure/lists/ScopeColumn';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';
import Footer from 'in-components/Footer/Footer';
import { role } from 'in-stores/user';

import locals from './Alerts.mless';

export default function Alerts() {
  const handlers = role?.canConfigureGlobalInfraSmartAlerts && !role?.limitedInfrastructureScope ? actionHandlers : {};

  function getColumnDefinitions() {
    return [
      {
        id: 'filterApplied',
        label: '',
        getContent: (entity: InfraSmartAlertConfigWithMetadata) => <ScopeColumn config={entity} />
      }
    ];
  }

  return (
    <>
      <div className={locals.wrapper}>
        <AlertBaseList<InfraSmartAlertConfigWithMetadata>
          extraColumnDefinitions={getColumnDefinitions()}
          actionHandlers={handlers}
          getAlertConfigs={() => getAllAlertConfigsWithResult()}
          createRowLinkLocation={createRowLinkLocation}
          getSubtitle={config => getSubtitle(config.rule, config.threshold, config.forecastingConfig)}
          sortOptions={sortOptions}
          alertsTab={infraSmartAlerts}
          renderName={replaceTitlePlaceholdersWithMarkup}
          hideAlertIcon
        />
      </div>
      <Footer />
    </>
  );
}

export function getSubtitle(
  rule: InfraAlertRuleUnion,
  threshold: ThresholdConfigUnion & { value?: number },
  forecastingConfig?: ForecastingConfig
) {
  const { type, operator, value } = threshold;
  const { entityType, metricName, aggregation } = rule;

  if (type === STATIC_THRESHOLD) {
    const humanReadableOperator = humanReadableThresholdOperator(operator);

    return (
      <MetricLabel
        entityType={entityType}
        metricName={metricName}
        aggregation={aggregation}
        humanReadableOperator={humanReadableOperator}
        value={value ?? 0}
        forecastingConfig={forecastingConfig ?? null}
      />
    );
  }

  throw new Error('Not yet supported threshold type: ' + type);
}

function createRowLinkLocation(config: InfraSmartAlertConfigWithMetadata, location: Location): Location {
  const rowLinkLocation = {
    ...location,
    pathname: infraAlertDetailsFullyQualifiedPath
  };

  setOrDeleteMatrixKey(rowLinkLocation, infraAlertsDetailsPath, alertIdMatrixParam, config.id);
  setOrDeleteMatrixKey(rowLinkLocation, infraAlertsDetailsPath, alertCreatedMatrixParam, config.created);
  return rowLinkLocation;
}
