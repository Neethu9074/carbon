/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode, useState } from 'react';

import { Observable } from '@instana/observables';
import { Card } from '@instana/components';

import List from 'in-settings/components/List';
import { t } from 'in-i18n';

interface AlertBaseListProps<AlertConfig> {
  loadEntities: () => Observable<AlertConfig[]>;
  extraColumnDefinitions: ColumnDefinition<AlertConfig>[];
}

interface ColumnDefinition<AlertConfig extends Object> {
  id: number | string;
  label: string;
  getContent: (entity: AlertConfig) => ReactNode;
}

const nameColumn: ColumnDefinition<{ name: string }> = {
  id: 'name',
  label: 'Name',
  getContent: item => <span>{item.name}</span>
};

export default function AlertBaseList<AlertConfig extends { name: string }>({
  extraColumnDefinitions,
  loadEntities
}: AlertBaseListProps<AlertConfig>) {
  const [alertsSize, setAlertsSize] = useState<number | null>(null);

  const header = t('in-alerting:smartAlerts.list.header.configuredAlerts', { numberOfAlerts: alertsSize });

  return (
    <>
      <Card size="l">
        <List<AlertConfig>
          getHeader={() => header}
          columnDefinitions={[nameColumn, ...extraColumnDefinitions]}
          loadEntities={() => loadEntities().tap(alerts => setAlertsSize(alerts.length))}
          searchAttributes={[(entity: AlertConfig) => entity.name]}
          pageSize={15}
        />
      </Card>
    </>
  );
}
