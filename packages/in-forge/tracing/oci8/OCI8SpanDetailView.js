/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function OCI8SpanDetailView({ span }) {
  const statement = span.getIn(['data', 'oci8', 'stmt']);

  return (
    <div>
      <Dl>
        <Di title="Connection">{span.getIn(['data', 'oci8', 'conn'])}</Di>
        {statement ? (
          <Di title="Query" verticalDisplay>
            <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
          </Di>
        ) : null}
        <ErrorDescriptionItem error={span.getIn(['data', 'oci8', 'error'])} />
        <Di title="Error Code">{span.getIn(['data', 'oci8', 'error_code'])}</Di>
      </Dl>
    </div>
  );
}
