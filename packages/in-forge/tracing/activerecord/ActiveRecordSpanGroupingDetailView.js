import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function ActiveRecordSpanGroupingDetailView({ span }) {
  const sql = span.getIn(['data', 'activerecord', 'sql']);
  if (!sql) {
    return null;
  }

  return (
    <DescriptionList>
      <DescriptionItem title="SQL">
        <Code code={formatSql(sql)} lang="sql" />
      </DescriptionItem>
    </DescriptionList>
  );
}
