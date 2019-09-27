import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function PostgresSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'pg', 'stmt'], span.getIn(['data', 'pg', 'sql']));

  return (
    <DescriptionList>
      <DescriptionItem title="Host">{span.getIn(['data', 'pg', 'host'])}</DescriptionItem>
      <DescriptionItem title="Port">{span.getIn(['data', 'pg', 'port'])}</DescriptionItem>
      <DescriptionItem title="Database">{span.getIn(['data', 'pg', 'db'])}</DescriptionItem>
      <DescriptionItem title="User">{span.getIn(['data', 'pg', 'user'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'pg', 'error'])} />

      {statement ? (
        <DescriptionItem title="Query" verticalDisplay>
          <Code code={formatSql(statement)} lang="sql" />
        </DescriptionItem>
      ) : null}
    </DescriptionList>
  );
}
