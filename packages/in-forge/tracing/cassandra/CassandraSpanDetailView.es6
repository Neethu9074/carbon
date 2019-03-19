import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function CassandraSpanDetailView({ span }) {
  const fullyFetched = span.getIn(['data', 'cassandra', 'fullyFetched']);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Keyspace">{span.getIn(['data', 'cassandra', 'keyspace'])}</DescriptionItem>
        {span.getIn(['data', 'cassandra', 'fetchSize']) != null && (
          <DescriptionItem title="Fetch Size">
            {span.getIn(['data', 'cassandra', 'fetchSize'])}

            {/* Support string and boolean as possible types in the JSON */}
            {fullyFetched != null && ' (' + (String(fullyFetched) === 'false' ? 'not ' : '') + 'fully fetched)'}
          </DescriptionItem>
        )}
        <DescriptionItem title="Achieved Consistency">
          {span.getIn(['data', 'cassandra', 'achievedConsistency'])}
        </DescriptionItem>
        <DescriptionItem title="Tried Hosts">{span.getIn(['data', 'cassandra', 'triedHosts'])}</DescriptionItem>
        <Query span={span} />
        <ErrorDescriptionItem error={span.getIn(['data', 'cassandra', 'error'])} />
      </DescriptionList>
    </div>
  );
}

function Query({ span }) {
  const statement = span.getIn(['data', 'cassandra', 'query']);
  if (!statement) {
    return null;
  }

  let lang = 'sql';
  let code = formatSql(statement);

  return (
    <DescriptionItem title="Query">
      <Code code={code} lang={lang} />
    </DescriptionItem>
  );
}
