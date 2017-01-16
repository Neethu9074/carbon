import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function CassandraSpanDetailView({span}) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Keyspace'>
          {span.getIn(['data', 'cassandra', 'keyspace'])}
        </DescriptionItem>
        <DescriptionItem title='Batch Size'>
          {span.getIn(['data', 'cassandra', 'batchSize'])}
        </DescriptionItem>
        <DescriptionItem title='Fetch Size'>
          {span.getIn(['data', 'cassandra', 'fetchSize'])}
        </DescriptionItem>
        <DescriptionItem title='Query'>
          {span.getIn(['data', 'cassandra', 'query'])}
        </DescriptionItem>
        <DescriptionItem title='Error'>
          {span.getIn(['data', 'cassandra', 'error'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
