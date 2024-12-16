/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmMqSubscription.name')}>{data.get('subName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqSubscription.queueManager')}>
        {data.get('qmName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqSubscription.clusterName')}>
        {data.get('clusterName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqSubscription.subType')}>{data.get('subType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqSubscription.subAlternatedAt')}>
        {data.get('subAlternatedAt')}
      </DescriptionItem>
    </DescriptionList>
  );
}
