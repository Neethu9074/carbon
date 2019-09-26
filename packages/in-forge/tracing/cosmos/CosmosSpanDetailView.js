import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function CosmosSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'cosmos', 'cmd']);
  return (
    <div>
      <DescriptionList>
        {statement ? (
          <DescriptionItem title="Statement">
            <Code code={formatSql(statement)} lang="sql" />
          </DescriptionItem>
        ) : null}{' '}
      </DescriptionList>
    </div>
  );
}
