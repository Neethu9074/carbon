/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import { Observable } from '@instana/observables';
import { Card } from '@instana/components';
import { Result } from '@instana/types';

import SmartAlertsListWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsListWithUrlState';
import { ListActionsColumn } from 'in-alerting/smart-alerts/components/list/columns/ListActionsColumn';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import { SortOption } from 'in-components/SortingConfigurator/SortingConfigurator';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

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
  getAlertConfigs: () => Observable<Result<AlertConfig[]>>;
  extraColumnDefinitions: ColumnDefinition<AlertConfig>[];
  getSubtitle?: ((config: AlertConfig) => string) | ((config: AlertConfig) => JSX.Element);
  createRowLinkLocation?: (config: AlertConfig, location: Location) => Location;
  actionHandlers?: ActionHandlers<AlertConfig>;
  sortOptions?: SortOption[];
  alertsTab: string;
  renderName?: ((config: AlertConfig) => string) | ((config: AlertConfig) => ReactNode);
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
}

export default function AlertBaseList<AlertConfig extends AlertConfigType>({
  extraColumnDefinitions,
  getAlertConfigs,
  getSubtitle,
  createRowLinkLocation,
  sortOptions = [],
  actionHandlers,
  alertsTab,
  renderName
}: AlertBaseListProps<AlertConfig>) {
  const columnDef = createColumnDefinition(extraColumnDefinitions, actionHandlers, getSubtitle, renderName);

  return (
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
  );
}

function createColumnDefinition<AlertConfig extends AlertConfigType>(
  extraColumnDefinitions: ColumnDefinition<AlertConfig>[],
  actionHandlers: ActionHandlers<AlertConfig> | undefined,
  getSubtitle?: ((config: AlertConfig) => string) | ((config: AlertConfig) => JSX.Element),
  renderName?: ((config: AlertConfig) => string) | ((config: AlertConfig) => ReactNode)
) {
  const nameColumn: ColumnDefinition<AlertConfig> = {
    id: 'name',
    width: '35%',
    label: t('in-alerting:smartAlerts.list.columns.name'),
    getContent: config => (
      <NameColumnCell<AlertConfig> config={config} getSubtitle={getSubtitle} renderName={renderName} />
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
