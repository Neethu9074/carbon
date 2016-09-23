import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function JdbcPool({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Connection Creation Retry Interval (sec)'>
        {data.get('jdbc_pool.connection_creation_retry_interval_sec')}
      </DescriptionItem>
      <DescriptionItem title='Connection Creation Retry Attempts'>
        {data.get('jdbc_pool.connection_creation_retry_attempts')}
      </DescriptionItem>
      <DescriptionItem title='Idle Timeout (sec)'>
        {data.get('jdbc_pool.idle_timeout_in_sec')}
      </DescriptionItem>
      <DescriptionItem title='Max wait time (ms)'>
        {data.get('jdbc_pool.max_wait_time_in_ms')}
      </DescriptionItem>
      <DescriptionItem title='Max pool size'>
        {data.get('jdbc_pool.max_pool_size')}
      </DescriptionItem>
      <DescriptionItem title='Steady pool size'>
        {data.get('jdbc_pool.steady_pool_size')}
      </DescriptionItem>
    </DescriptionList>
  );
}
