import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function MySqlSpanGroupingDetailView({ span }) {
  const statement = span.getIn(['data', 'mysql', 'stmt'], span.getIn(['data', 'mysql', 'sql']));
  if (!statement) {
    return null;
  }

  return (
    <DescriptionList>
      <DescriptionItem title="Query">
        <Code code={formatSql(statement)} lang="sql" />
      </DescriptionItem>
    </DescriptionList>
  );
}
