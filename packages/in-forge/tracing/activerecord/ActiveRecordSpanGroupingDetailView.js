/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function ActiveRecordSpanGroupingDetailView({ span }) {
  const sql = span.getIn(['data', 'activerecord', 'sql']);
  if (!sql) {
    return null;
  }

  return (
    <Dl>
      <Di title="SQL" verticalDisplay>
        <Code code={formatSql(sql)} lang="sql" showLineNumbers={false} />
      </Di>
    </Dl>
  );
}
