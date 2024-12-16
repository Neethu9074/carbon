/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { t } from 'in-i18n';

export default function PostgreSqlInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.postgreSqlDatabase.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.postgreSqlDatabase.port')}>{data.get('port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.postgreSqlDatabase.maxConnections')}>
        {data.get('max_connections')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.postgreSqlDatabase.version')}>
        {data.get('variables.VERSION')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.postgreSqlDatabase.role')}>{data.get('type')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
