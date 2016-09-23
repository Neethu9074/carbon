import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import {formatDateTime} from 'in-services/formatters/date';

import ThreadPool from './ThreadPool';
import JdbcPool from './JdbcPool';
import ConnectionPool from './ConnectionPool';

export default function GlassfishInfo({snapshot}) {
  const data = snapshot.get('data');
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Process ID'>
          {data.get('pid')}
        </DescriptionItem>
        <DescriptionItem title='Port'>
          {data.get('port')}
        </DescriptionItem>
        <DescriptionItem title='Version'>
          {data.get('version')}
        </DescriptionItem>
        <DescriptionItem title='Started at'>
          {formatDateTime(data.get('started_at'))}
        </DescriptionItem>
        <DescriptionItem title='Domain Name'>
          {data.get('domain_name')}
        </DescriptionItem>
        <DescriptionItem title='Applications'>
          {data.get('applications')}
        </DescriptionItem>
      </DescriptionList>

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          thread-pool
        </Collapsible.Header>
        <Collapsible.Content>
          <ThreadPool snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          jdbc-pool
        </Collapsible.Header>
        <Collapsible.Content>
          <JdbcPool snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          connection-pool
        </Collapsible.Header>
        <Collapsible.Content>
          <ConnectionPool snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
