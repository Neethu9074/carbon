import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function ThreadPool({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Idle Thread Timeout (sec)'>
        {data.get('thread_pool.idle_thread_timeout_sec')}
      </DescriptionItem>
      <DescriptionItem title='Max Queue Size'>
        {data.get('thread_pool.max_queue_size')}
      </DescriptionItem>
      <DescriptionItem title='Max Thread Pool Size'>
        {data.get('thread_pool.max_thread_pool_size')}
      </DescriptionItem>
      <DescriptionItem title='Min Thread Pool Size'>
        {data.get('thread_pool.min_thread_pool_size')}
      </DescriptionItem>
    </DescriptionList>
  );
}
