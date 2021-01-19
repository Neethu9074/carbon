/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function CosmosSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'cosmos', 'cmd']);
  if (!statement) {
    return null;
  }

  return (
    <Dl>
      <Di title="Statement" verticalDisplay>
        <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
      </Di>
    </Dl>
  );
}
