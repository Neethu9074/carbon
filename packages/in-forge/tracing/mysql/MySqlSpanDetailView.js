import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function MySqlSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'mysql', 'stmt'], span.getIn(['data', 'mysql', 'sql']));

  return (
    <DescriptionList>
      <DescriptionItem title="Host">{span.getIn(['data', 'mysql', 'host'])}</DescriptionItem>
      <DescriptionItem title="Port">{span.getIn(['data', 'mysql', 'port'])}</DescriptionItem>
      <DescriptionItem title="Database">{span.getIn(['data', 'mysql', 'db'])}</DescriptionItem>
      <DescriptionItem title="User">{span.getIn(['data', 'mysql', 'user'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'mysql', 'error'])} />

      {statement ? (
        <DescriptionItem title="Query" verticalDisplay>
          <Code code={formatSql(statement)} lang="sql" />
        </DescriptionItem>
      ) : null}
    </DescriptionList>
  );
}
