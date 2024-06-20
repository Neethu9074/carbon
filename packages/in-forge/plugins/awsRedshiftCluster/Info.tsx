/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function ClusterInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftCluster.name')}>
        {data.get('cluster_identifier')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftCluster.arn')}>
        {data.get('cluster_namespace_arn')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftCluster.creationTime')}>
        {data.get('cluster_create_time')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftCluster.totalStorageCapacityInMegabytes')}>
        {data.get('total_storage_capacity_in_megabytes')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftCluster.endpoint')}>{data.get('address')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftCluster.port')}>{data.get('port')}</DescriptionItem>
    </DescriptionList>
  );
}
