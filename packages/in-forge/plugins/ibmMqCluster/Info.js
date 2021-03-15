/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmMqCluster.name')}>{data.get('clusterName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqCluster.startedAt')}>
        {data.get('clusterDateTime')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqCluster.alternatedAt')}>
        {data.get('clusterAlternated')}
      </DescriptionItem>
    </DescriptionList>
  );
}
