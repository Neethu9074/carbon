/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import { Observable } from '@instana/observables';
import { Result } from '@instana/types';

import SmartAlertsTableWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsTableWithUrlState';
import { ColumnDefinition as ServerTableColumnDefinition } from 'in-components/tables/ServerTable/types';
import { ListActionsColumn } from 'in-alerting/smart-alerts/components/list/columns/ListActionsColumn';
import TableNameColumnCell from 'in-alerting/smart-alerts/components/table/TableNameColumnCell';
import { SortOption } from 'in-alerting/smart-alerts/components/list/TableSortingConfigurator';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

export type ActionHandlers<AlertConfig extends AlertConfigType> = {
  handleClone?: (config: AlertConfig) => void;
  handleDelete?: (
    id: string,
    setIsSaving: (saving: boolean) => void,
    configName: string,
    trackCta?: CtaTrackingFunction
  ) => void;
  handleEdit?: (config: AlertConfig) => void;
  handleToggleEnabled?: (
    enabled: boolean,
    id: string,
    setIsSaving: (saving: boolean) => void,
    config?: AlertConfig
  ) => void;
};

export interface AlertURLProps {
  alertId?: string;
  alertConfigCreated?: number;
  duplicateMode?: boolean;
  editMode?: boolean;
}

interface AlertBaseListProps<AlertConfig extends AlertConfigType> {
  getAlertConfigs: () => Observable<Result<AlertConfig[]>>;
  extraCarbonTableColumnDefinitions: ServerTableColumnDefinition<AlertConfig>[];
  noDataHeader: string;
  noDataDescription: string | JSX.Element;
  getNameSubtitle?: ((config: AlertConfig) => string) | ((config: AlertConfig) => JSX.Element);
  createRowLinkLocation?: (config: AlertConfig, location: Location) => Location;
  carbonActionHandlers?: ActionHandlers<AlertConfig>;
  sortOptions?: SortOption[];
  alertsTab: string;
  toolBarContent?: JSX.Element;
  isSelectable?: boolean;
  useSmartAlertCreateUrl?: (args: AlertURLProps) => string;
  displayTitle?: boolean;
}

export interface AlertConfigType {
  name: string;
  severity: number;
  description: string;
  enabled: boolean;
  id: string;
  created: number;
  initialCreated: number;
  rule?: { alertType?: string };
}

export interface ColumnDefinition<AlertConfig extends AlertConfigType> {
  id: string;
  label: string;
  width?: string;
  getContent: (entity: AlertConfig) => ReactNode;
  sortable?: boolean;
  ellipsis?: string;
}

export default function AlertBaseList<AlertConfig extends AlertConfigType>({
  extraCarbonTableColumnDefinitions,
  getAlertConfigs,
  getNameSubtitle,
  createRowLinkLocation,
  sortOptions = [],
  carbonActionHandlers,
  alertsTab,
  toolBarContent = undefined,
  isSelectable = false,
  noDataHeader,
  noDataDescription,
  useSmartAlertCreateUrl,
  displayTitle = false
}: AlertBaseListProps<AlertConfig>) {
  const columnDefForTable = createTableColumnDefinition(
    extraCarbonTableColumnDefinitions,
    getNameSubtitle,
    carbonActionHandlers,
    createRowLinkLocation,
    useSmartAlertCreateUrl
  );

  return (
    <SmartAlertsTableWithUrlState<AlertConfig>
      columnDefinitions={columnDefForTable}
      getLocalAlertConfigsFetchFunction={getAlertConfigs}
      getLocalAlertConfigTitle={(numberOfAlerts: number) =>
        !displayTitle
          ? t('in-alerting:smartAlerts.list.header.configuredAlerts', {
              numberOfAlerts
            })
          : ''
      }
      alertsTab={alertsTab}
      toolBarContent={toolBarContent}
      isSelectable={isSelectable}
      noDataHeader={noDataHeader}
      noDataDescription={noDataDescription}
      sortOptions={sortOptions}
    />
  );
}

function createTableColumnDefinition<AlertConfig extends AlertConfigType>(
  extraCarbonTableColumnDefinitions?: ServerTableColumnDefinition<AlertConfig>[],
  getNameSubtitle?: ((config: AlertConfig) => string) | ((config: AlertConfig) => JSX.Element),
  carbonActionHandlers?: ActionHandlers<AlertConfig>,
  createRowLinkLocation?: (config: AlertConfig, location: Location) => Location,
  useSmartAlertCreateUrl?: (args: AlertURLProps) => string
) {
  const nameColumn: ColumnDefinition<AlertConfig> = {
    id: 'name',
    label: t('in-alerting:smartAlerts.list.columns.name'),
    sortable: true,
    ellipsis: '30vw',
    getContent: config => (
      <TableNameColumnCell<AlertConfig>
        config={config}
        getNameSubtitle={getNameSubtitle}
        createRowLinkLocation={createRowLinkLocation}
      />
    )
  };

  if (carbonActionHandlers) {
    const actionsColumn = {
      id: 'actions',
      label: '',
      getContent: (config: AlertConfig) => (
        <ListActionsColumn
          config={config}
          actionHandlers={carbonActionHandlers}
          isLoading={false}
          icon={'lib_menu_more_vertical'}
          useSmartAlertCreateUrl={useSmartAlertCreateUrl}
        />
      ),
      sortable: false
    };
    return [nameColumn, ...(extraCarbonTableColumnDefinitions ?? []), actionsColumn];
  }

  return [nameColumn, ...(extraCarbonTableColumnDefinitions ?? [])];
}
