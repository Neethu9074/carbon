import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function MySQLiSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'mysqli', 'stmt']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="DSN">
          {span.getIn(['data', 'mysqli', 'dsn'])}
        </DescriptionItem>
        {statement
          ? <DescriptionItem title="Query">
              <Code code={formatSql(statement)} lang="sql" />
            </DescriptionItem>
          : null}
        <DescriptionItem title="Error">
          {span.getIn(['data', 'mysqli', 'error'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
