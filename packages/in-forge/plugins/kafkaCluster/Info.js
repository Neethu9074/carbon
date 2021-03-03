/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const nodes = snapshot.getIn(['data', 'nodes'], emptyList);
  const uniqueClusterName = data.get('clusterName') !== data.get('zookeeper');

  return (
    <DescriptionList>
      {uniqueClusterName ? (
        <DescriptionItem title={t('in-forge:plugins.kafkaCluster.clusterName')}>
          {data.get('clusterName')}
        </DescriptionItem>
      ) : null}
      <DescriptionItem title={t('in-forge:plugins.kafkaCluster.zookeeper')}>{data.get('zookeeper')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kafkaCluster.nodes')}>{nodes.size}</DescriptionItem>
    </DescriptionList>
  );
}
