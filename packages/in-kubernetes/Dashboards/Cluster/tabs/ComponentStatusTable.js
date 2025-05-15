/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, DataTable as CarbonDataTable } from '@instana/components';

import EmptyContent from 'in-components/tables/ServerTable/internalComponents/EmptyContent';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { compare } from 'in-services/util/boolean';
import { t } from 'in-i18n';

import locals from './ComponentStatusTable.mless';

export default function ComponentStatusTable({ cluster }) {
  const componentStatuses = cluster.componentStatuses || [];
  const carbonHeaders = [
    {
      key: 'component',
      header: t('in-kubernetes:dashboards.component')
    },
    {
      key: 'message',
      header: t('in-kubernetes:dashboards.message')
    },
    {
      key: 'conditionStatus',
      header: t('in-kubernetes:dashboards.conditionStatus')
    }
  ];

  const carbonRows = (componentStatuses ?? [])
    .slice()
    .sort((a, b) => compare(a.healthy, b.healthy))
    .map(({ name, conditionMessage, conditionStatus }) => ({
      id: name,
      ['component']: name,
      ['message']: conditionMessage,
      ['conditionStatus']: conditionStatus
    }));

  return (
    <Card title={t('in-kubernetes:dashboards.componentStatus')} disableLayer>
      <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
      <div className={locals.emptyTable}>
        {componentStatuses.length === 0 && (
          <EmptyContent
            renderNoDataAvailable={() => (
              <NoDataAvailable text={t('in-kubernetes:dashboards.noComponentStatusDataAvailable')} height={80} />
            )}
            noDataMessage={() => (
              <NoDataAvailable text={t('in-kubernetes:dashboards.noComponentStatusDataAvailable')} height={80} />
            )}
          />
        )}
      </div>
    </Card>
  );
}
