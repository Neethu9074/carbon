/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.googleCloudStorage.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudStorage.id')}>{data.get('id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudStorage.projectNumber')}>
        {data.get('projectNumber')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudStorage.region')}>{data.get('gceZone')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudStorage.locationType')}>
        {data.get('locationType')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudStorage.storageClass')}>
        {data.get('storageClass')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudStorage.createdAt')}>
        {formatDateTime(data.get('created', ''))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudStorage.updatedAt')}>
        {formatDateTime(data.get('updated', ''))}
      </DescriptionItem>
    </DescriptionList>
  );
}
