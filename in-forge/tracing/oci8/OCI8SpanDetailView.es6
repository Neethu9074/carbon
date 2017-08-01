import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function OCI8SpanDetailView({ span }) {
  const statement = span.getIn(['data', 'oci8', 'stmt']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Connection">
          {span.getIn(['data', 'oci8', 'conn'])}
        </DescriptionItem>
        {statement
          ? <DescriptionItem title="Query">
              <Code code={formatSql(statement)} lang="sql" />
            </DescriptionItem>
          : null}
        <DescriptionItem title="Error">
          {span.getIn(['data', 'oci8', 'error'])}
        </DescriptionItem>
        <DescriptionItem title="Error Code">
          {span.getIn(['data', 'oci8', 'error_code'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
