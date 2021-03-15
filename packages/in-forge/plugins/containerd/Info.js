/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DateTimeWithPeriodSinceDescriptionItem } from 'in-sdk/components/sidebar/DateTimeWithPeriodSinceDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function ContainerdInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.containerd.infoId')}>{data.get('id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.containerd.infoImage')}>{data.get('image')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.containerd.infoNamespace')}>{data.get('namespace')}</DescriptionItem>
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.containerd.infoCreatedAt')}
        dateTime={data.get('createdAt')}
      />
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.containerd.infoUpdatedAt')}
        dateTime={data.get('updatedAt')}
      />
    </DescriptionList>
  );
}
