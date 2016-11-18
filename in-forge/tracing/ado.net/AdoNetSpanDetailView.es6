import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatSql} from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';


export default function JdbcSpanDetailView({span}) {
  const statement = span.getIn(['data', 'ado', 'command']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Connection'>
          {span.getIn(['data', 'ado', 'connection'])}
        </DescriptionItem>
        <DescriptionItem title='Command-Type'>
          {span.getIn(['data', 'ado', 'type'])}
        </DescriptionItem>
        {statement ?
          <DescriptionItem title='Statement'>
            <Code code={formatSql(statement)}
                  lang='sql' />
          </DescriptionItem>
        : null}
      </DescriptionList>
    </div>
  );
}
