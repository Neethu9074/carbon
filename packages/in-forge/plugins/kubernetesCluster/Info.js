/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.kubernetesCluster.cluster')}>{data.get('clusterId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kubernetesCluster.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kubernetesCluster.namespace')}>
        {data.get('namespace')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kubernetesCluster.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kubernetesCluster.hostIp')}>{data.get('hostIp')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kubernetesCluster.podIp')}>{data.get('podIp')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kubernetesCluster.phase')}>{data.get('phase')}</DescriptionItem>
    </DescriptionList>
  );
}
