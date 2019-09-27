import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function CosmosSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'cosmos', 'cmd']);
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
