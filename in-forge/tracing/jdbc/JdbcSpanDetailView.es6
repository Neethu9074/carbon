import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function JdbcSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'jdbc', 'statement']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Connection">
          {span.getIn(['data', 'jdbc', 'connection'])}
        </DescriptionItem>
        <DescriptionItem title="Timeout">
          {span.getIn(['data', 'jdbc', 'timeout'])}
        </DescriptionItem>
        <DescriptionItem title="Result Size">
          {span.getIn(['data', 'jdbc', 'size'])}
        </DescriptionItem>
        <DescriptionItem title="Error">
          {span.getIn(['data', 'jdbc', 'error'])}
        </DescriptionItem>

        {statement
          ? <DescriptionItem title="Statement">
              <Code code={formatSql(statement)} lang="sql" />
            </DescriptionItem>
          : null}
      </DescriptionList>
    </div>
  );
}
