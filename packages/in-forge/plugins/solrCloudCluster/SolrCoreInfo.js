/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function SolrCoreInfo({ snapshot, core }) {
  const data = snapshot.get('data');
  const start = data.get('cores.' + core + '.started_at');
  return (
    <DescriptionList>
      {start && (
        <DescriptionItem title={t('in-forge:plugins.solrCloudCluster.startedAt')}>
          {formatDateTime(start)} ({fromNowAccurately(start)})
        </DescriptionItem>
      )}
      <DescriptionItem title={t('in-forge:plugins.solrCloudCluster.version')}>
        {data.get('cores.' + core + '.version')}
      </DescriptionItem>
    </DescriptionList>
  );
}
