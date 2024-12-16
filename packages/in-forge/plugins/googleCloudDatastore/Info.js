/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const createdAt = data.get('createTime');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.googleCloudDatastore.name')}>
        {data.get('projectName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudDatastore.id')}>{data.get('projectId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudDatastore.number')}>
        {data.get('projectNumber')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudDatastore.createdAt')}>
        {formatDateTime(createdAt)}
      </DescriptionItem>
    </DescriptionList>
  );
}
