import React from 'react';

import {formatSql} from 'in-forge/tracing/jdbc/sql';
import Code from 'in-components/Code';

export default function MySqlSpanDetailView({span}) {
  const statement = span.getIn(['data', 'mysql', 'sql']);

  return (
    <div>
      {statement ?
        <Code code={formatSql(statement)}
              lang='sql' />
      : null}
    </div>
  );
}
