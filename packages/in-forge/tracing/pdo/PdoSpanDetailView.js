import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function PdoSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'pdo', 'stmt']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Driver">{span.getIn(['data', 'pdo', 'driver'])}</DescriptionItem>
        <DescriptionItem title="DSN">{span.getIn(['data', 'pdo', 'dsn'])}</DescriptionItem>

        {statement ? (
          <DescriptionItem title="Query">
            <Code code={formatSql(statement)} lang="sql" />
          </DescriptionItem>
        ) : null}

        <ErrorDescriptionItem error={span.getIn(['data', 'pdo', 'error'])} />
        <DescriptionItem title="Error Code">{span.getIn(['data', 'pdo', 'error_code'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
