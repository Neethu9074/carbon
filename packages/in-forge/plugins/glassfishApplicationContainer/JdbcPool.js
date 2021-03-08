/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function JdbcPool({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.connectionCreationRetryIntervalSec')}>
        {data.get('jdbc_pool.connection_creation_retry_interval_sec')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.connectionCreationRetryAttempts')}>
        {data.get('jdbc_pool.connection_creation_retry_attempts')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.idleTimeoutSec')}>
        {data.get('jdbc_pool.idle_timeout_in_sec')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.maxWaitTimeMs')}>
        {data.get('jdbc_pool.max_wait_time_in_ms')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.maxPoolSize')}>
        {data.get('jdbc_pool.max_pool_size')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.steadyPoolSize')}>
        {data.get('jdbc_pool.steady_pool_size')}
      </DescriptionItem>
    </DescriptionList>
  );
}
