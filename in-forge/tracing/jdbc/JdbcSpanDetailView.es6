import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatSql} from 'in-forge/tracing/jdbc/sql';
import Code from 'in-components/Code';


export default function JdbcSpanDetailView({span}) {
  const statement = span.getIn(['data', 'jdbc', 'statement']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Connection'>
          {span.getIn(['data', 'jdbc', 'connection'])}
        </DescriptionItem>
      </DescriptionList>

      {statement ?
        <Code code={formatSql(statement)}
              type='sql' />
      : null}
    </div>
  );
}
