import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function CassandraSpanDetailView({span}) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Statement'>
          {span.getIn(['data', 'cassandra', 'statement'])}
        </DescriptionItem>
        <DescriptionItem title='Keyspace'>
          {span.getIn(['data', 'cassandra', 'keyspace'])}
        </DescriptionItem>
        <DescriptionItem title='Batch Size'>
          {span.getIn(['data', 'cassandra', 'batchSize'])}
        </DescriptionItem>
        <DescriptionItem title='Query'>
          {span.getIn(['data', 'cassandra', 'query'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
