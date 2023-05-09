/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode, useState } from 'react';

import { Observable } from '@instana/observables';
import { Card } from '@instana/components';
import { Result } from '@instana/types';

import { ListActionsColumn } from 'in-alerting/smart-alerts/applications/list/columns/ListActionsColumn';
import SmartAlertsBaseList from 'in-alerting/smart-alerts/applications/list/SmartAlertsBaseList';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import List, { TableActions as ListTableActions } from 'in-settings/components/List';
import { SortOption } from 'in-components/SortingConfigurator/SortingConfigurator';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

export type TableActions<T> = Omit<ListTableActions<T>, 'deselect'> & {
  toggleEnabled?: {
    get: (config: T) => boolean;
    toggle: (config: T) => void;
  };
};

export type ActionHandlers<AlertConfig extends AlertConfigType> = {
  handleClone?: (config: AlertConfig) => void;
  handleDelete?: (id: string, setIsSaving: (saving: boolean) => void, configName: string) => void;
  handleEdit?: (config: AlertConfig) => void;
  handleToggleEnabled?: (
    enabled: boolean,
    id: string,
    setIsSaving: (saving: boolean) => void,
    config?: AlertConfig
  ) => void;
};

interface AlertBaseListProps<AlertConfig extends AlertConfigType> {
  loadEntities?: any;
  getAlertConfigs?: () => Observable<Result<AlertConfig[]>>;
  extraColumnDefinitions: ColumnDefinition<AlertConfig>[];
  tableActions?: TableActions<AlertConfig>;
  rightHeader?: any;
  noDataMessage?: string;
  pageSize?: any;
  getSubtitle?: (config: AlertConfig) => string;
  onRowClick?: (config: AlertConfig) => void;
  createRowLinkLocation?: (config: AlertConfig, location: Location) => Location;
  actionHandlers?: ActionHandlers<AlertConfig>;
  sortOptions?: SortOption[];
  addExtraColumn?: boolean;
}

export interface AlertConfigType {
  name: string;
  severity: number;
  description: string;
  enabled: boolean;
  id: string;
  created: number;
}

export interface ColumnDefinition<AlertConfig extends AlertConfigType> {
  id: string;
  label: string;
  width?: string;
  getContent: (entity: AlertConfig) => ReactNode;
}

/**
 * Currently there are 2 ways to use this base-list:
 * with old {loadEntities} or
 * with {getAlertConfigs} (supporting loading state)
 *
 * Both are needed until the synthetics-list will have been migrated.
 */
export default function AlertBaseList<AlertConfig extends AlertConfigType>({
  extraColumnDefinitions,
  loadEntities,
  getAlertConfigs,
  tableActions,
  getSubtitle,
  onRowClick,
  createRowLinkLocation,
  sortOptions = [],
  rightHeader,
  noDataMessage,
  pageSize,
  addExtraColumn = false,
  actionHandlers
}: AlertBaseListProps<AlertConfig>) {
  const [alertsSize, setAlertsSize] = useState<number | null>(null);
  const header = t('in-alerting:smartAlerts.list.header.configuredAlerts', { numberOfAlerts: alertsSize });
  const columnDef = createColumnDefinition(extraColumnDefinitions, actionHandlers, getSubtitle, addExtraColumn);

  if (loadEntities)
    return (
      <Card size="l">
        <List<AlertConfig>
          getHeader={() => header}
          getEntityName={entity => entity.name}
          tableActions={tableActions}
          columnDefinitions={columnDef}
          noDataMessage={noDataMessage}
          loadEntities={() => loadEntities().tap((alerts: any) => setAlertsSize(alerts.length))}
          searchAttributes={[(entity: AlertConfig) => entity.name]}
          pageSize={pageSize ?? 15}
          rightHeader={rightHeader}
          onRowClick={onRowClick}
        />
      </Card>
    );

  if (getAlertConfigs) {
    return (
      <Card size="l">
        <SmartAlertsBaseList<AlertConfig>
          columnDefinitions={columnDef.map(toAlertListColumns)}
          getLocalAlertConfigsFetchFunction={getAlertConfigs}
          sortOptions={sortOptions}
          pageSize={15}
          createRowLinkLocation={createRowLinkLocation}
        />
      </Card>
    );
  }

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn('AlertBaseList: Please either provide getAlertConfigs or loadEntities property.');
  }
  return null;
}

function createColumnDefinition<AlertConfig extends AlertConfigType>(
  extraColumnDefinitions: ColumnDefinition<AlertConfig>[],
  actionHandlers: ActionHandlers<AlertConfig> | undefined,
  getSubtitle?: (config: AlertConfig) => string,
  addExtraColumn?: boolean
) {
  const nameColumn: ColumnDefinition<AlertConfig> = {
    id: 'name',
    width: '35%',
    label: t('in-alerting:smartAlerts.list.columns.name'),
    getContent: config => <NameColumnCell<AlertConfig> config={config} getSubtitle={getSubtitle} />
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
  if (!addExtraColumn) return [nameColumn, ...extraColumnDefinitions];
  return [...extraColumnDefinitions];
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
