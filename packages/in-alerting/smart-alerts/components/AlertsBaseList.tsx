/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode, useState } from 'react';
import classNames from 'classnames';

import { Observable } from '@instana/observables';
import { SvgIcon } from '@instana/components';
import { Card } from '@instana/components';

import List, { TableActions as ListTableActions } from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/Alerts.mless';

export type TableActions<T> = Omit<ListTableActions<T>, 'deselect'> & {
  toggleEnabled?: {
    get: (config: T) => boolean;
    toggle: (config: T) => void;
  };
};

interface AlertBaseListProps<AlertConfig extends AlertConfigType> {
  loadEntities: () => Observable<AlertConfig[]>;
  extraColumnDefinitions: ColumnDefinition<AlertConfig>[];
  tableActions?: TableActions<AlertConfig>;
  getSubtitle?: (config: AlertConfig) => string;
  onRowClick?: (config: AlertConfig) => void;
}

interface AlertConfigType {
  name: string;
  severity: number;
  description: string;
}

interface ColumnDefinition<AlertConfig extends AlertConfigType> {
  id: number | string;
  label: string;
  getContent: (entity: AlertConfig) => ReactNode;
}

export default function AlertBaseList<AlertConfig extends AlertConfigType>({
  extraColumnDefinitions,
  loadEntities,
  tableActions,
  getSubtitle,
  onRowClick
}: AlertBaseListProps<AlertConfig>) {
  const [alertsSize, setAlertsSize] = useState<number | null>(null);
  const header = t('in-alerting:smartAlerts.list.header.configuredAlerts', { numberOfAlerts: alertsSize });
  const nameColumn: ColumnDefinition<AlertConfig> = {
    id: 'name',
    label: t('in-alerting:smartAlerts.list.columns.name'),
    getContent: config => <NameContent<AlertConfig> config={config} getSubtitle={getSubtitle} />
  };

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
          onRowClick={onRowClick}
        />
      </Card>
    </>
  );
}

function NameContent<AlertConfig extends AlertConfigType>({
  config,
  getSubtitle
}: {
  config: AlertConfig;
  getSubtitle?: (config: AlertConfig) => string;
}) {
  return (
    <div className={classNames(locals.centered, locals.fullWidth)}>
      <SvgIcon
        className={classNames({
          [locals.alertIcon]: true,
          [locals.alertIconSeverityLow]: config.severity <= 5,
          [locals.alertIconSeverityHigh]: config.severity > 5
        })}
        type="lib_alerts_alert"
      />
      <div className={classNames(locals.column, locals.fullWidth)}>
        <Tooltip themeStyle="light" content={config.description} align="topMiddle" delay={500}>
          <div className={classNames(locals.name, locals.fullWidth)}>{config.name}</div>
        </Tooltip>
        {getSubtitle && <div className={locals.nameSubtext}>{getSubtitle(config)}</div>}
      </div>
    </div>
  );
}
