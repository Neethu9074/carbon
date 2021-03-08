/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const createdAt = data.get('createTime');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.googleCloudPubSub.name')}>{data.get('projectName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudPubSub.id')}>{data.get('projectId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudPubSub.number')}>
        {data.get('projectNumber')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudPubSub.createdAt')}>
        {formatDateTime(createdAt)}
      </DescriptionItem>
    </DescriptionList>
  );
}
