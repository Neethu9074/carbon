import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatSql} from 'in-forge/tracing/jdbc/sql';
import Code from 'in-components/Code';


export default function IbmDb2SpanDetailView({span}) {
  const statement = span.getIn(['data', 'db2', 'stmt']);

  return (
    <div>
      <DescriptionList>
        {statement ?
          <DescriptionItem title='Query'>
              <Code code={formatSql(statement)}
                    lang='sql' />
          </DescriptionItem>
        : null}
      </DescriptionList>
    </div>
  );
}
