/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DateTimeWithPeriodSinceDescriptionItem } from 'in-sdk/components/sidebar/DateTimeWithPeriodSinceDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function CrioInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.crio.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.crio.namespace')}>{data.get('namespace')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.crio.image')}>{data.get('image')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.crio.id')}>{data.get('id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.crio.ip')}>{data.get('ip')}</DescriptionItem>
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.crio.createdAt')}
        dateTime={data.get('created')}
      />
    </DescriptionList>
  );
}
