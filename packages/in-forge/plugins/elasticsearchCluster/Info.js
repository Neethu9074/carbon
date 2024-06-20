/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ClusterStatusLabel from 'in-forge/plugins/elasticsearchCluster/ClusterStatusLabel';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.elasticsearchCluster.name')}>{data.get('groupId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.elasticsearchCluster.status')}>
        <ClusterStatusLabel status={data.get('clusterState')} />
      </DescriptionItem>
    </DescriptionList>
  );
}
