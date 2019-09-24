import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function Neo4jSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'neo4j', 'stmt']);

  return (
    <DescriptionList>
      <DescriptionItem title="Connection">{span.getIn(['data', 'neo4j', 'conn'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'neo4j', 'error'])} />
      {statement ? (
        <DescriptionItem title="Statement" verticalDisplay>
          <Code code={formatSql(statement)} lang="sql" />
        </DescriptionItem>
      ) : null}
    </DescriptionList>
  );
}
