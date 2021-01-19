/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function CouchbaseSpanDetailView({ span }) {
  const sql = span.getIn(['data', 'couchbase', 'sql']);

  return (
    <div>
      <Dl>
        <Di title="Hostname">{span.getIn(['data', 'couchbase', 'hostname'])}</Di>
        <Di title="Bucket">{span.getIn(['data', 'couchbase', 'bucket'])}</Di>
        <Di title="Type">{span.getIn(['data', 'couchbase', 'type'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'couchbase', 'error'])} />
        <Di title="Error Code">{span.getIn(['data', 'couchbase', 'error_code'])}</Di>

        {sql ? (
          <Di title="SQL" verticalDisplay>
            <Code code={formatSql(sql)} lang="sql" showLineNumbers={false} />
          </Di>
        ) : null}
      </Dl>
    </div>
  );
}
