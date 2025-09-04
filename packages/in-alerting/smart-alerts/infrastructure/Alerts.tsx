/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import {
  infraAlertsDetailsPath,
  infraAlertDetailsFullyQualifiedPath,
  infraSmartAlerts
} from 'in-stores/navigation/paths/mainPaths';
import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-infrastructure/navigation/matrix';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { getAllAlertConfigsWithResult } from 'in-alerting/smart-alerts/infrastructure/api/infrastructureAlertConfig';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/infrastructure/hooks/useSmartAlertCreateUrl';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { actionHandlers } from 'in-alerting/smart-alerts/infrastructure/lists/ListActionHandlers';
import CreateSmartAlert from 'in-alerting/smart-alerts/infrastructure/CreateSmartAlert';
import { MetricLabel } from 'in-alerting/smart-alerts/infrastructure/lists/MetricLabel';
import { sortOptions } from 'in-alerting/smart-alerts/infrastructure/lists/constants';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { TableCellWrapper } from 'in-alerting/components/TableCellWrapper';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import PluginIcon from 'in-components/PluginIcon/PluginIcon';
import { eventsPath } from 'in-events/navigation/paths';
import { Location } from 'in-stores/navigation/types';
import { getPluginName } from 'in-sdk/pluginName';
import Footer from 'in-components/Footer/Footer';
import { t, Trans } from 'in-i18n';

import locals from './Alerts.mless';

export default function Alerts({ isEventsView = false }: { isEventsView?: boolean }) {
  const [role] = useCurrentUserRole();
  const handlers = role?.canConfigureGlobalInfraSmartAlerts && !role?.limitedInfrastructureScope ? actionHandlers : {};

  const List = (
    <AlertBaseList<InfraSmartAlertConfigWithMetadata>
      getAlertConfigs={() => getAllAlertConfigsWithResult()}
      createRowLinkLocation={createRowLinkLocation}
      sortOptions={sortOptions}
      alertsTab={isEventsView ? eventsPath : infraSmartAlerts}
      extraCarbonTableColumnDefinitions={getCarbonTableColumnDefinitions()}
      carbonActionHandlers={handlers}
      getNameSubtitle={(config: InfraSmartAlertConfigWithMetadata) => getNameSubtitle(config)}
      toolBarContent={role?.canConfigureGlobalInfraSmartAlerts ? <CreateSmartAlert /> : undefined}
      noDataHeader={t('in-alerting:smartAlerts.infrastructure.list.noDataHeader')}
      noDataDescription={<Trans i18nKey="in-alerting:smartAlerts.infrastructure.list.noDataDescription" />}
      useSmartAlertCreateUrl={useSmartAlertCreateUrl}
      displayTitle={isEventsView}
    />
  );

  if (isEventsView) {
    return List;
  }

  return (
    <>
      <DashboardHeaderShadowModule />
      <LeftRightPadding>{List}</LeftRightPadding>
      <Footer />
    </>
  );
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

function getCarbonTableColumnDefinitions() {
  return [
    {
      id: 'triggering-action',
      label: t('in-alerting:table.triggeringAction'),
      ellipsis: '25vw',
      getContent: (config: InfraSmartAlertConfigWithMetadata) => (
        <TableCellWrapper>
          <MetricLabel rule={config.rule} threshold={config.threshold} forecastingConfig={config.forecastingConfig} />
        </TableCellWrapper>
      ),
      sortable: false
    }
    // TODO bring this back once the bulk actions are implemented
    // {
    //   id: 'enabled',
    //   label: t('in-alerting:table.status'),
    //   getContent: ({ enabled }: InfraSmartAlertConfigWithMetadata) => <StatusColumnCell status={enabled} />,
    //   sortable: true
    // }
  ];
}

function getNameSubtitle(config: InfraSmartAlertConfigWithMetadata) {
  const {
    rule: { entityType }
  } = config;
  if (entityType) {
    return (
      <span className={locals.iconWrapper}>
        <PluginIcon color={themes.default.ids.color.option.neutral['700']} plugin={entityType} size="s" />
        {getPluginName(entityType, 1)}
      </span>
    );
  }
  throw new Error('Not yet supported entity type: ' + entityType);
}
