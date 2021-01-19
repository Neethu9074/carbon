/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function JdbcSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'ado', 'command']);
  const error = span.getIn(['data', 'ado', 'error']);
  return (
    <div>
      <Dl>
        <Di title="Connection">{span.getIn(['data', 'ado', 'connection'])}</Di>
        <Di title="Command-Type">{span.getIn(['data', 'ado', 'type'])}</Di>
        {statement ? (
          <Di title="Statement" verticalDisplay>
            <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
          </Di>
        ) : null}
        <Di title="Result-Size">{span.getIn(['data', 'ado', 'resultsize'])}</Di>
        <ErrorDescriptionItem error={error} />
      </Dl>
    </div>
  );
}
