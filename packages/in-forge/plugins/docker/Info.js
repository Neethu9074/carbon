/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DateTimeWithPeriodSinceDescriptionItem } from 'in-sdk/components/sidebar/DateTimeWithPeriodSinceDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function DockerInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.docker.image')}>{data.get('Image')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.docker.command')}>{data.get('Command')}</DescriptionItem>
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.docker.createdAt')}
        dateTime={data.get('Created')}
      />
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.docker.startedAt')}
        dateTime={data.get('Started')}
      />
      <DescriptionItem title={t('in-forge:plugins.docker.id')}>{data.get('Id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.docker.names')}>
        {data.get('Names', emptyList).join(', ')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.docker.networkMode')}>{data.get('NetworkMode')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.docker.storageDriver')}>{data.get('StorageDriver')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.docker.dockerVersion')}>{data.get('docker_version')}</DescriptionItem>
    </DescriptionList>
  );
}
