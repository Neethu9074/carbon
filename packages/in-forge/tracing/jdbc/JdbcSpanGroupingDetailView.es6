import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function JdbcSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'jdbc', 'statement']);
  if (!statement) {
    return null;
  }

  return (
    <DescriptionList>
      <DescriptionItem title="Statement">
        <Code code={formatSql(statement)} lang="sql" />
      </DescriptionItem>
    </DescriptionList>
  );
}
