import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {SpanTabs, SpanTab} from 'in-components/SpanTabs';
import StackTrace from 'in-components/StackTrace';

export default function HttpSpanDetailView({span}) {
  const stackTrace = span.get('stackTrace');

  return (
    <SpanTabs>
      <SpanTab title='Overview'>
        <DescriptionList>
          <DescriptionItem title='URL'>
            {span.getIn(['data', 'http', 'url'])}
          </DescriptionItem>
          <DescriptionItem title='Method'>
            {span.getIn(['data', 'http', 'method'])}
          </DescriptionItem>
          <DescriptionItem title='Status Code'>
            {span.getIn(['data', 'http', 'status_code'])}
          </DescriptionItem>
        </DescriptionList>
      </SpanTab>

      {stackTrace && stackTrace.size > 0 ?
        <SpanTab title='Stack Trace'>
          <StackTrace stackTrace={stackTrace} />
        </SpanTab>
      : null}
    </SpanTabs>
  );
}
