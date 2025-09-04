/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import { Result, RuleWithThreshold } from '@instana/types';
import { Observable } from '@instana/observables';

import {
  severityCritical,
  severityWarning
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertLevelRow';
import SmartAlertsTableWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsTableWithUrlState';
import { ColumnDefinition as ServerTableColumnDefinition } from 'in-components/tables/ServerTable/types';
import { ListActionsColumn } from 'in-alerting/smart-alerts/components/list/columns/ListActionsColumn';
import TableNameColumnCell from 'in-alerting/smart-alerts/components/table/TableNameColumnCell';
import { SortOption } from 'in-alerting/smart-alerts/components/list/TableSortingConfigurator';
import SeverityColumn from 'in-alerting/smart-alerts/components/list/columns/SeverityColumn';
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
  hideSeverity?: boolean;
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
  rules?: RuleWithThreshold<any>[];
}

export interface ColumnDefinition<AlertConfig extends AlertConfigType> {
  id: string;
  label: string;
  width?: string;
  getContent: (entity: AlertConfig) => ReactNode;
  sortable?: boolean;
  ellipsis?: string;
  hideSeverity?: boolean;
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
  displayTitle = false,
  hideSeverity = false
}: AlertBaseListProps<AlertConfig>) {
  const columnDefForTable = createTableColumnDefinition(
    extraCarbonTableColumnDefinitions,
    getNameSubtitle,
    carbonActionHandlers,
    createRowLinkLocation,
    useSmartAlertCreateUrl,
    hideSeverity
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
  useSmartAlertCreateUrl?: (args: AlertURLProps) => string,
  hideSeverity?: boolean
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

  const severityColumn: ColumnDefinition<AlertConfig> = {
    id: 'severity',
    label: t('in-alerting:smartAlerts.list.columns.severity'),
    sortable: true,
    ellipsis: '10vw',
    getContent: config => {
      const { rules } = config;
      const severity = { severity: config?.severity };
      const warningThreshold =
        rules?.[0].thresholds?.WARNING || config?.severity === severityWarning ? severity : undefined;
      const criticalThreshold =
        rules?.[0].thresholds?.CRITICAL || config?.severity === severityCritical ? severity : undefined;
      return <SeverityColumn warningThreshold={warningThreshold} criticalThreshold={criticalThreshold} />;
    }
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
    return [
      nameColumn,
      ...(extraCarbonTableColumnDefinitions ?? []),
      ...(hideSeverity ? [] : [severityColumn]),
      actionsColumn
    ];
  }

  return [nameColumn, ...(extraCarbonTableColumnDefinitions ?? []), ...(hideSeverity ? [] : [severityColumn])];
}
