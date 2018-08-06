import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function CassandraSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Keyspace">{span.getIn(['data', 'cassandra', 'keyspace'])}</DescriptionItem>
        <DescriptionItem title="Fetch Size">{span.getIn(['data', 'cassandra', 'fetchSize'])}</DescriptionItem>
        <DescriptionItem title="Query">{span.getIn(['data', 'cassandra', 'query'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'cassandra', 'error'])} />
      </DescriptionList>
    </div>
  );
}
