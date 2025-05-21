/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';

import {
  serviceLevelsAlertDetailsFullyQualified,
  serviceLevelsAlertsSegment,
  serviceLevelsObjectiveAlertDetailsFullyQualified
} from 'in-service-levels/navigation/path';
import { ListActionsColumn } from 'in-alerting/smart-alerts/components/list/columns/ListActionsColumn';
import { sloSmartAlertDetailsUrlParameters } from 'in-service-levels/navigation/urlParameters';
import { getAllSloAlertConfigurations } from 'in-alerting/smart-alerts/slo/api/sloAlertConfig';
import { getActionHandlers } from 'in-alerting/smart-alerts/slo/list/AlertListHandlers';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import SloAppliedColumn from 'in-alerting/smart-alerts/slo/list/SloAppliedColumn';
import AlertTypeColumn from 'in-alerting/smart-alerts/slo/list/AlertTypeColumn';
import CreateSmartAlert from 'in-alerting/smart-alerts/slo/CreateSmartAlert';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { sortOptions } from 'in-alerting/smart-alerts/slo/constants';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import Footer from 'in-components/Footer/Footer';
import { Trans, t } from 'in-i18n';

export interface AlertsProps {
  sloId?: string;
}

export default function Alerts({ sloId }: AlertsProps) {
  const location = useLocation();
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.slo,
          pageRootName: pageNames.smart_alerts,
          pagePath: location?.pathname
        }}
      />

      <AlertBaseList<ServiceLevelsAlertConfigWithMetadata>
        extraColumnDefinitions={columnDefinitions}
        getAlertConfigs={() => getAllSloAlertConfigurations(sloId)}
        createRowLinkLocation={(config, location) => createRowLinkLocation(config, location, sloId)}
        alertsTab={serviceLevelsAlertsSegment}
        getSubtitle={config =>
          (config.rule.metric === 'BURN_RATE' && t('in-alerting:smartAlerts.slo.alertList.deprecatedLabel')) || ''
        }
        sortOptions={sortOptions}
        // for carbon table
        displayCarbonTable={smartAlertCarbonTableEnabled}
        getNameSubtitle={config =>
          (config.rule.metric === 'BURN_RATE' && t('in-alerting:smartAlerts.slo.alertList.deprecatedLabel')) || ''
        }
        extraCarbonTableColumnDefinitions={getCarbonTableColumnDefinitions()}
        noDataHeader={t('in-alerting:smartAlerts.slo.alertList.noDataHeader')}
        noDataDescription={<Trans i18nKey="in-alerting:smartAlerts.slo.alertList.noDataDescription" />}
        toolBarContent={<CreateSmartAlert sloId={sloId} />}
      />
      <Footer />
    </>
  );
}

const columnDefinitions = [
  {
    id: 'alertType',
    label: t('in-alerting:table.triggeringAction'),
    width: '30%',
    getContent: (config: ServiceLevelsAlertConfigWithMetadata) => <AlertTypeColumn config={config} />
  },
  {
    id: 'sloApplied',
    label: t('in-alerting:smartAlerts.slo.alertList.alertListSloAppliedColumnName'),
    getContent: (config: ServiceLevelsAlertConfigWithMetadata) => <SloAppliedColumn config={config} />
  },
  // used custom action handler component since we conditionally render alert actions
  {
    id: 'slo-actions',
    label: '',
    getContent: (config: ServiceLevelsAlertConfigWithMetadata) => (
      <ListActionsColumn config={config} actionHandlers={getActionHandlers(config)} isLoading={false} />
    )
  }
];

function getCarbonTableColumnDefinitions() {
  return [
    {
      id: 'triggering-action',
      label: t('in-alerting:table.triggeringAction'),
      ellipsis: '25vw',
      getContent: (config: ServiceLevelsAlertConfigWithMetadata) => <AlertTypeColumn config={config} />,
      sortable: false
    },
    // used custom action handler component since we conditionally render alert actions
    {
      id: 'slo-actions',
      label: '',
      getContent: (config: ServiceLevelsAlertConfigWithMetadata) => (
        <ListActionsColumn config={config} actionHandlers={getActionHandlers(config)} isLoading={false} />
      )
    }
  ];
}

function createRowLinkLocation(
  config: ServiceLevelsAlertConfigWithMetadata,
  location: Location,
  id?: string
): Location {
  if (id) {
    location.pathname = serviceLevelsObjectiveAlertDetailsFullyQualified;
  } else {
    location.pathname = serviceLevelsAlertDetailsFullyQualified;
  }
  const alertIdParameter = sloSmartAlertDetailsUrlParameters.alertId;
  const alertCreatedParameter = sloSmartAlertDetailsUrlParameters.alertCreated;
  setOrDeleteMatrixKey(location, alertIdParameter.path ?? '', alertIdParameter.name, config.id);
  setOrDeleteMatrixKey(location, alertCreatedParameter.path ?? '', alertCreatedParameter.name, config.created);

  return location;
}
