/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import { Observable } from '@instana/observables';
import { Card } from '@instana/components';

import SmartAlertsTableWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsTableWithUrlState';
import SmartAlertsListWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsListWithUrlState';
import { ColumnDefinition as ServerTableColumnDefinition } from 'in-components/tables/ServerTable/types';
import { ListActionsColumn } from 'in-alerting/smart-alerts/components/list/columns/ListActionsColumn';
import TableNameColumnCell from 'in-alerting/smart-alerts/components/table/TableNameColumnCell';
import { SortOption } from 'in-alerting/smart-alerts/components/list/TableSortingConfigurator';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { Location } from 'in-stores/navigation/types';
import { Result } from 'in-types';
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

interface AlertBaseListProps<AlertConfig extends AlertConfigType> {
  getAlertConfigs: () => Observable<Result<AlertConfig[]>>;
  extraColumnDefinitions: ColumnDefinition<AlertConfig>[];
  extraCarbonTableColumnDefinitions: ServerTableColumnDefinition<AlertConfig>[];
  noDataHeader: string;
  noDataDescription: string | JSX.Element;
  getSubtitle?: ((config: AlertConfig) => string) | ((config: AlertConfig) => JSX.Element);
  getNameSubtitle?: ((config: AlertConfig) => string) | ((config: AlertConfig) => JSX.Element);
  createRowLinkLocation?: (config: AlertConfig, location: Location) => Location;
  actionHandlers?: ActionHandlers<AlertConfig>;
  carbonActionHandlers?: ActionHandlers<AlertConfig>;
  sortOptions?: SortOption[];
  alertsTab: string;
  renderName?: ((config: AlertConfig) => string) | ((config: AlertConfig) => ReactNode);
  hideAlertIcon?: boolean;
  displayCarbonTable?: boolean;
  toolBarContent?: JSX.Element;
  isSelectable?: boolean;
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
  extraColumnDefinitions,
  extraCarbonTableColumnDefinitions,
  getAlertConfigs,
  getSubtitle,
  getNameSubtitle,
  createRowLinkLocation,
  sortOptions = [],
  actionHandlers,
  carbonActionHandlers,
  alertsTab,
  renderName,
  hideAlertIcon,
  displayCarbonTable = false,
  toolBarContent = undefined,
  isSelectable = false,
  noDataHeader,
  noDataDescription
}: AlertBaseListProps<AlertConfig>) {
  const columnDef = createColumnDefinition(
    extraColumnDefinitions,
    actionHandlers,
    getSubtitle,
    renderName,
    hideAlertIcon
  );

  const columnDefForTable = createTableColumnDefinition(
    extraCarbonTableColumnDefinitions,
    getNameSubtitle,
    carbonActionHandlers,
    createRowLinkLocation
  );

  return (
    <>
      {displayCarbonTable ? (
        <SmartAlertsTableWithUrlState<AlertConfig>
          columnDefinitions={columnDefForTable}
          getLocalAlertConfigsFetchFunction={getAlertConfigs}
          getLocalAlertConfigTitle={(numberOfAlerts: number) =>
            t('in-alerting:smartAlerts.list.header.configuredAlerts', {
              numberOfAlerts
            })
          }
          alertsTab={alertsTab}
          toolBarContent={toolBarContent}
          isSelectable={isSelectable}
          noDataHeader={noDataHeader}
          noDataDescription={noDataDescription}
          sortOptions={sortOptions}
        />
      ) : (
        <Card size="l">
          <SmartAlertsListWithUrlState<AlertConfig>
            columnDefinitions={columnDef.map(toAlertListColumns)}
            getLocalAlertConfigsFetchFunction={getAlertConfigs}
            getLocalAlertConfigTitle={(numberOfAlerts: number) =>
              t('in-alerting:smartAlerts.list.header.configuredAlerts', {
                numberOfAlerts
              })
            }
            sortOptions={sortOptions}
            pageSize={15}
            createRowLinkLocation={createRowLinkLocation}
            alertsTab={alertsTab}
          />
        </Card>
      )}
    </>
  );
}

function createColumnDefinition<AlertConfig extends AlertConfigType>(
  extraColumnDefinitions: ColumnDefinition<AlertConfig>[],
  actionHandlers: ActionHandlers<AlertConfig> | undefined,
  getSubtitle?: ((config: AlertConfig) => string) | ((config: AlertConfig) => JSX.Element),
  renderName?: ((config: AlertConfig) => string) | ((config: AlertConfig) => ReactNode),
  hideAlertIcon?: boolean
) {
  const nameColumn: ColumnDefinition<AlertConfig> = {
    id: 'name',
    width: '35%',
    label: t('in-alerting:smartAlerts.list.columns.name'),
    getContent: config => (
      <NameColumnCell<AlertConfig>
        config={config}
        getSubtitle={getSubtitle}
        renderName={renderName}
        hideAlertIcon={hideAlertIcon ?? false}
      />
    )
  };

  if (actionHandlers) {
    const actionsColumn = {
      id: 'actions',
      label: 'Action',
      getContent: (config: AlertConfig) => (
        <ListActionsColumn config={config} actionHandlers={actionHandlers} isLoading={false} />
      )
    };
    return [nameColumn, ...extraColumnDefinitions, actionsColumn];
  }
  return [nameColumn, ...extraColumnDefinitions];
}

/** adapter, because we use a different column format:
 *  getContent: ( config: AlertConfig }) {}
 *
 *  compared the one, used Smart-Alert-List, based on {ColumnizedContent}
 *  getContent: ({ config }: { config: AlertConfig }) {}
 */
function toAlertListColumns<AlertConfig extends AlertConfigType>(column: ColumnDefinition<AlertConfig>) {
  return {
    ...column,
    getContent: ({ config }: { config: AlertConfig }) => {
      return column.getContent(config);
    }
  };
}

function createTableColumnDefinition<AlertConfig extends AlertConfigType>(
  extraCarbonTableColumnDefinitions?: ServerTableColumnDefinition<AlertConfig>[],
  getNameSubtitle?: ((config: AlertConfig) => string) | ((config: AlertConfig) => JSX.Element),
  carbonActionHandlers?: ActionHandlers<AlertConfig>,
  createRowLinkLocation?: (config: AlertConfig, location: Location) => Location
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
        />
      ),
      sortable: false
    };
    return [nameColumn, ...(extraCarbonTableColumnDefinitions ?? []), actionsColumn];
  }

  return [nameColumn, ...(extraCarbonTableColumnDefinitions ?? [])];
}
