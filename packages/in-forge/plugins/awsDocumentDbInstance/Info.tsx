/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function InstanceInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsDocumentDbInstance.name')}>
        {data.get('instance_identifier')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsDocumentDbInstance.arn')}>
        {data.get('instance_arn')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsDocumentDbInstance.clusterArn')}>
        {data.get('cluster_arn')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsDocumentDbInstance.creationTime')}>
        {data.get('instance_creation_time')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsDocumentDbInstance.promotionTier')}>
        {data.get('promotion_tier')}
      </DescriptionItem>
    </DescriptionList>
  );
}
