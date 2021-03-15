/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function SybaseInfo({ snapshot }) {
  const data = snapshot.get('data');
  const databases = data.get('databaseNames', emptyList);
  return (
    <DescriptionList>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.infoTitle.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.startTime')}>{data.get('startTime')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.port')}>{data.get('port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.type')}>{data.get('serverType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.version')}>{data.get('serverVersion')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{data.get('serverName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.maxConnections')}>
        {data.get('maxConnections')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.databases')}>{databases.count()}</DescriptionItem>
    </DescriptionList>
  );
}
