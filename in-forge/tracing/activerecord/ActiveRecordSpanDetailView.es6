import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function ActiveRecordSpanDetailView({ span }) {
  const sql = span.getIn(['data', 'activerecord', 'sql']);

  return (
    <DescriptionList>
      <DescriptionItem title="Adapter">
        {span.getIn(['data', 'activerecord', 'adapter'])}
      </DescriptionItem>
      <DescriptionItem title="Database">
        {span.getIn(['data', 'activerecord', 'db'])}
      </DescriptionItem>
      <DescriptionItem title="Database Host">
        {span.getIn(['data', 'activerecord', 'host'])}
      </DescriptionItem>
      <DescriptionItem title="Username">
        {span.getIn(['data', 'activerecord', 'username'])}
      </DescriptionItem>
      <DescriptionItem title="Error">
        {span.getIn(['data', 'activerecord', 'error'])}
      </DescriptionItem>

      {sql
        ? <DescriptionItem title="SQL">
            <Code code={formatSql(sql)} lang="sql" />
          </DescriptionItem>
        : null}
    </DescriptionList>
  );
}
