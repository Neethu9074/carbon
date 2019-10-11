import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function JdbcSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'jdbc', 'statement']);

  return (
    <div>
      <Dl>
        <Di title="Connection">{span.getIn(['data', 'jdbc', 'connection'])}</Di>
        <Di title="User">{span.getIn(['data', 'jdbc', 'user'])}</Di>
        <Di title="Timeout">{span.getIn(['data', 'jdbc', 'timeout'])}</Di>
        <Di title="Result Size">{span.getIn(['data', 'jdbc', 'size'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'jdbc', 'error'])} />

        {statement ? (
          <Di title="Statement" verticalDisplay>
            <Code code={formatSql(statement)} lang="sql" />
          </Di>
        ) : null}
      </Dl>
    </div>
  );
}
