/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function ClusterInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsDocumentDbElasticCluster.name')}>
        {data.get('cluster_identifier')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsDocumentDbElasticCluster.arn')}>
        {data.get('cluster_arn')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsDocumentDbElasticCluster.creationTime')}>
        {data.get('cluster_create_time')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsDocumentDbElasticCluster.clusterType')}>
        {data.get('cluster_type')}
      </DescriptionItem>
    </DescriptionList>
  );
}
