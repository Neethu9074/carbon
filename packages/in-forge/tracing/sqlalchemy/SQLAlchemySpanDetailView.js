import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function SQLAlchemySpanDetailView({ span }) {
  const sql = span.getIn(['data', 'sqlalchemy', 'sql']);

  return (
    <DescriptionList>
      <DescriptionItem title="Engine">{span.getIn(['data', 'sqlalchemy', 'eng'])}</DescriptionItem>
      <DescriptionItem title="URL">{span.getIn(['data', 'sqlalchemy', 'url'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'sqlalchemy', 'err'])} />

      {sql ? (
        <DescriptionItem title="SQL">
          <Code code={formatSql(sql)} lang="sql" />
        </DescriptionItem>
      ) : null}
    </DescriptionList>
  );
}
