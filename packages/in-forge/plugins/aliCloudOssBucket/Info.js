/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.aliCloudOssBucket.region')}>{data.get('region')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudOssBucket.userId')}>{data.get('userID')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudOssBucket.instanceId')}>
        {data.get('instanceId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudOssBucket.storageClass')}>
        {data.get('storageClass')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudOssBucket.creationDate')}>
        {data.get('creationDate')}
      </DescriptionItem>
    </DescriptionList>
  );
}
