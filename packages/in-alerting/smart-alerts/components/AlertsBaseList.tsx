/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode, useState } from 'react';

import { Observable } from '@instana/observables';
import { Card } from '@instana/components';

import List, { TableActions as ListTableActions } from 'in-settings/components/List';
import { t } from 'in-i18n';

export type TableActions<T> = Omit<ListTableActions<T>, 'deselect'> & {
  toggleEnabled?: {
    get: (config: T) => boolean;
    toggle: (config: T) => void;
  };
};

interface AlertBaseListProps<AlertConfig extends Object> {
  loadEntities: () => Observable<AlertConfig[]>;
  extraColumnDefinitions: ColumnDefinition<AlertConfig>[];
  tableActions?: TableActions<AlertConfig>;
}

interface ColumnDefinition<AlertConfig extends Object> {
  id: number | string;
  label: string;
  getContent: (entity: AlertConfig) => ReactNode;
}

const nameColumn: ColumnDefinition<{ name: string }> = {
  id: 'name',
  label: t('in-synthetics:dashboard.alertList.alertName'),
  getContent: item => <span>{item.name}</span>
};

export default function AlertBaseList<AlertConfig extends { name: string }>({
  extraColumnDefinitions,
  loadEntities,
  tableActions
}: AlertBaseListProps<AlertConfig>) {
  const [alertsSize, setAlertsSize] = useState<number | null>(null);

  const header = t('in-alerting:smartAlerts.list.header.configuredAlerts', { numberOfAlerts: alertsSize });

  return (
    <>
      <Card size="l">
        <List<AlertConfig>
          getHeader={() => header}
          getEntityName={entity => entity.name}
          tableActions={tableActions}
          columnDefinitions={[nameColumn, ...extraColumnDefinitions]}
          loadEntities={() => loadEntities().tap(alerts => setAlertsSize(alerts.length))}
          searchAttributes={[(entity: AlertConfig) => entity.name]}
          pageSize={15}
        />
      </Card>
    </>
  );
}
