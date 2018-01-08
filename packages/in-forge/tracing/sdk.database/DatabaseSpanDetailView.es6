import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function DatabaseSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'db', 'statement']);
  const dbType = span.getIn(['data', 'db', 'type']);
  const custom = span.getIn(['data', 'sdk', 'custom']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Instance">{span.getIn(['data', 'db', 'instance'])}</DescriptionItem>
        <DescriptionItem title="Type">{span.getIn(['data', 'db', 'type'])}</DescriptionItem>
        <DescriptionItem title="User">{span.getIn(['data', 'db', 'user'])}</DescriptionItem>

        {statement ? (
          <DescriptionItem title="Statement">
            {dbType === 'sql' ? <Code code={formatSql(statement)} lang="sql" /> : <Code code={statement} />}
          </DescriptionItem>
        ) : null}

        {custom ? (
          <DescriptionItem title="Data">
            <Code code={JSON.stringify(custom.toJS(), 0, 2)} lang="json" />
          </DescriptionItem>
        ) : null}
      </DescriptionList>
    </div>
  );
}
