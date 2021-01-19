/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function ActiveRecordSpanDetailView({ span }) {
  const sql = span.getIn(['data', 'activerecord', 'sql']);

  return (
    <Dl>
      <Di title="Adapter">{span.getIn(['data', 'activerecord', 'adapter'])}</Di>
      <Di title="Database">{span.getIn(['data', 'activerecord', 'db'])}</Di>
      <Di title="Database Host">{span.getIn(['data', 'activerecord', 'host'])}</Di>
      <Di title="Username">{span.getIn(['data', 'activerecord', 'username'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'activerecord', 'error'])} />

      {sql ? (
        <Di title="SQL" verticalDisplay>
          <Code code={formatSql(sql)} lang="sql" showLineNumbers={false} />
        </Di>
      ) : null}
    </Dl>
  );
}
