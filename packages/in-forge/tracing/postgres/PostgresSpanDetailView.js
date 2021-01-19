/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function PostgresSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'pg', 'stmt'], span.getIn(['data', 'pg', 'sql']));

  return (
    <Dl>
      <Di title="Host">{span.getIn(['data', 'pg', 'host'])}</Di>
      <Di title="Port">{span.getIn(['data', 'pg', 'port'])}</Di>
      <Di title="Database">{span.getIn(['data', 'pg', 'db'])}</Di>
      <Di title="User">{span.getIn(['data', 'pg', 'user'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'pg', 'error'])} />

      {statement ? (
        <Di title="Query" verticalDisplay>
          <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
        </Di>
      ) : null}
    </Dl>
  );
}
