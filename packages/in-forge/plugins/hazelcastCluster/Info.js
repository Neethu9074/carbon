/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { yesOrNo } from 'in-services/formatters/boolean';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.hazelcastCluster.clusterId')}>
        {data.get('clusterId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hazelcastCluster.groupName')}>
        {data.get('groupName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hazelcastCluster.isClusterSafe')}>
        {yesOrNo(data.get('isClusterSafe'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
