/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function SQLAlchemySpanDetailView({ span }) {
  const sql = span.getIn(['data', 'sqlalchemy', 'sql']);

  return (
    <Dl>
      <Di title="Engine">{span.getIn(['data', 'sqlalchemy', 'eng'])}</Di>
      <Di title="URL">{span.getIn(['data', 'sqlalchemy', 'url'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'sqlalchemy', 'err'])} />

      {sql ? (
        <Di title="SQL" verticalDisplay>
          <Code code={formatSql(sql)} lang="sql" showLineNumbers={false} />
        </Di>
      ) : null}
    </Dl>
  );
}
