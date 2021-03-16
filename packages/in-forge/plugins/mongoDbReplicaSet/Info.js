/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const nodeCount = snapshot.getIn(['data', 'nodeCount'], emptyList);

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.mongoDbReplicaSet.replicaSetName')}>
        {data.get('clusterName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDbReplicaSet.nodes')}>{nodeCount}</DescriptionItem>
    </DescriptionList>
  );
}
