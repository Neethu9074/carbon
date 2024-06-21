/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function NodeInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftCluster.name')}>
        {data.get('cluster_identifier')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftCluster.arn')}>
        {data.get('cluster_namespace_arn')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftNode.arn')}>{data.get('node_arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftNode.name')}>{data.get('node_id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftNode.nodeType')}>{data.get('node_type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftNode.endpoint')}>
        {data.get('public_ip_address')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsRedshiftNode.port')}>{data.get('port')}</DescriptionItem>
    </DescriptionList>
  );
}
