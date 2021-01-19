/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function CassandraSpanDetailView({ span }) {
  const fullyFetched = span.getIn(['data', 'cassandra', 'fullyFetched']);
  return (
    <div>
      <Dl>
        <Di title="Keyspace">{span.getIn(['data', 'cassandra', 'keyspace'])}</Di>
        {span.getIn(['data', 'cassandra', 'fetchSize']) != null && (
          <Di title="Fetch Size">
            {span.getIn(['data', 'cassandra', 'fetchSize'])}

            {/* Support string and boolean as possible types in the JSON */}
            {fullyFetched != null && ' (' + (String(fullyFetched) === 'false' ? 'not ' : '') + 'fully fetched)'}
          </Di>
        )}
        <Di title="Achieved Consistency">{span.getIn(['data', 'cassandra', 'achievedConsistency'])}</Di>
        <Di title="Tried Hosts">{span.getIn(['data', 'cassandra', 'triedHosts'])}</Di>
        <Query span={span} />
        <ErrorDescriptionItem error={span.getIn(['data', 'cassandra', 'error'])} />
      </Dl>
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
    <Di title="Query" verticalDisplay>
      <Code code={code} lang={lang} />
    </Di>
  );
}
