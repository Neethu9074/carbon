/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.sapHana.systemId')}>{data.get('instanceId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.databaseName')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.instanceNumber')}>
        {data.get('instanceNumber')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.port')}>{data.get('port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.usage')}>{data.get('usage')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.distributed')}>{data.get('distributed')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.allServicesStarted')}>
        {data.get('allServicesStarted')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.maximumNumberOfSessions')}>
        {data.get('maxNumberOfSessions')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
