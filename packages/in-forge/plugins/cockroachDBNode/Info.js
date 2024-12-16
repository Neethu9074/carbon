/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import StatusLabel from './StatusLabel';
import { t } from 'in-i18n';

export default function CockroachDBInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.cockroachDBNode.infoNodeID')}>n{data.get('node_id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cockroachDBNode.infoClusterID')}>
        {data.get('cluster_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cockroachDBNode.infoVersion')}>
        {data.get('build_tag')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cockroachDBNode.infoCache')}>
        {data.get('cache_size')}
      </DescriptionItem>
      {data.get('ready') != null && (
        <DescriptionItem title={t('in-forge:plugins.cockroachDBNode.infoStatus')}>
          <StatusLabel status={data.get('ready')} insecure={data.get('insecure')} />
        </DescriptionItem>
      )}
    </DescriptionList>
  );
}
