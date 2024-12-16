/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function ConnectionPool({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.connectionRetrySec')}>
        {data.get('connection_pool.connection_retry_sec')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.idleTimeoutSec')}>
        {data.get('connection_pool.idle_timeout_sec')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.maxPoolSizeSec')}>
        {data.get('connection_pool.max_pool_size')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.maxWaitTimeMs')}>
        {data.get('connection_pool.max_wait_time_ms')}
      </DescriptionItem>
    </DescriptionList>
  );
}
