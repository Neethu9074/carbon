/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode, useState } from 'react';

import { Observable } from '@instana/observables';
import { Card } from '@instana/components';

import { ListActionsColumn } from 'in-alerting/smart-alerts/applications/list/columns/ListActionsColumn';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import List, { TableActions as ListTableActions } from 'in-settings/components/List';
import { t } from 'in-i18n';

export type TableActions<T> = Omit<ListTableActions<T>, 'deselect'> & {
  toggleEnabled?: {
    get: (config: T) => boolean;
    toggle: (config: T) => void;
  };
};

export type ActionHandlers = {
  handleClone: (config: AlertConfigType) => void;
  handleDelete: (id: string, setIsSaving: boolean, configName: string) => void;
  handleEdit: (config: string) => void;
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (saving: boolean) => void) => void;
};

interface AlertBaseListProps<AlertConfig extends AlertConfigType> {
  loadEntities: () => Observable<AlertConfig[]>;
  extraColumnDefinitions: ColumnDefinition<AlertConfig>[];
  tableActions?: TableActions<AlertConfig>;
  getSubtitle?: (config: AlertConfig) => string;
  onRowClick?: (config: AlertConfig) => void;
  actionHandlers?: ActionHandlers;
}

export interface AlertConfigType {
  name: string;
  severity: number;
  description: string;
  enabled: boolean;
}

export interface ColumnDefinition<AlertConfig extends AlertConfigType> {
  id: string;
  label: string;
  getContent: (entity: AlertConfig) => ReactNode;
}

export default function AlertBaseList<AlertConfig extends AlertConfigType>({
  extraColumnDefinitions,
  loadEntities,
  tableActions,
  getSubtitle,
  onRowClick,
  actionHandlers
}: AlertBaseListProps<AlertConfig>) {
  const [alertsSize, setAlertsSize] = useState<number | null>(null);
  const header = t('in-alerting:smartAlerts.list.header.configuredAlerts', { numberOfAlerts: alertsSize });
  const nameColumn: ColumnDefinition<AlertConfig> = {
    id: 'name',
    label: t('in-alerting:smartAlerts.list.columns.name'),
    getContent: config => <NameColumnCell<AlertConfig> config={config} getSubtitle={getSubtitle} />
  };

  const columnDef = actionHandlers
    ? [
        nameColumn,
        ...extraColumnDefinitions,
        {
          id: 'actions',
          label: 'Action',
          getContent: (config: AlertConfig) => (
            <ListActionsColumn config={config} actionHandlers={actionHandlers} isLoading={false} />
          )
        }
      ]
    : [nameColumn, ...extraColumnDefinitions];

  return (
    <>
      <Card size="l">
        <List<AlertConfig>
          getHeader={() => header}
          getEntityName={entity => entity.name}
          tableActions={tableActions}
          columnDefinitions={columnDef}
          loadEntities={() => loadEntities().tap(alerts => setAlertsSize(alerts.length))}
          searchAttributes={[(entity: AlertConfig) => entity.name]}
          pageSize={15}
          onRowClick={onRowClick}
        />
      </Card>
    </>
  );
}
