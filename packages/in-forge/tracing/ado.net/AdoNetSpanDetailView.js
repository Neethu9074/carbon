import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function JdbcSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'ado', 'command']);
  const error = span.getIn(['data', 'ado', 'error']);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Connection">{span.getIn(['data', 'ado', 'connection'])}</DescriptionItem>
        <DescriptionItem title="Command-Type">{span.getIn(['data', 'ado', 'type'])}</DescriptionItem>
        {statement ? (
          <DescriptionItem title="Statement" verticalDisplay>
            <Code code={formatSql(statement)} lang="sql" />
          </DescriptionItem>
        ) : null}
        <ErrorDescriptionItem error={error} />
      </DescriptionList>
    </div>
  );
}
