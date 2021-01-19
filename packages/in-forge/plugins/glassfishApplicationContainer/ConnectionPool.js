/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function ConnectionPool({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Connection Retry (sec)">
        {data.get('connection_pool.connection_retry_sec')}
      </DescriptionItem>
      <DescriptionItem title="Idle Timeout (sec)">{data.get('connection_pool.idle_timeout_sec')}</DescriptionItem>
      <DescriptionItem title="Max Pool Size (sec)">{data.get('connection_pool.max_pool_size')}</DescriptionItem>
      <DescriptionItem title="Max Wait Time (ms)">{data.get('connection_pool.max_wait_time_ms')}</DescriptionItem>
    </DescriptionList>
  );
}
