import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {SpanTabs, SpanTab} from 'in-components/SpanTabs';
import {formatSql} from 'in-forge/tracing/jdbc/sql';
import StackTrace from 'in-components/StackTrace';
import Code from 'in-components/Code';


export default function JdbcSpanDetailView({span}) {
  const statement = span.getIn(['data', 'jdbc', 'statement']);
  const stackTrace = span.get('stackTrace');

  return (
    <SpanTabs>
      <SpanTab title='Overview'>
        <DescriptionList>
          <DescriptionItem title='Connection'>
            {span.getIn(['data', 'jdbc', 'connection'])}
          </DescriptionItem>
        </DescriptionList>
      </SpanTab>

      {statement ?
        <SpanTab title='Statement'>
          <Code code={formatSql(statement)}
                type='sql' />
        </SpanTab>
      : null}

      {stackTrace && stackTrace.size > 0 ?
        <SpanTab title='Stack Trace'>
          <StackTrace stackTrace={stackTrace} />
        </SpanTab>
      : null}
    </SpanTabs>
  );
}
