/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from '@instana/components';

import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function RabbitMqClusterInfo({ snapshot }) {
  const data = snapshot.get('data');
  const nodes = data.get('nodes', emptyList);

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.rabbitMqCluster.clusterName')}>
        {data.get('cluster_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rabbitMqCluster.nodes')}>{nodes.size}</DescriptionItem>
    </DescriptionList>
  );
}
