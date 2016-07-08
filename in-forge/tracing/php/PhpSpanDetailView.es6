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
          <DescriptionItem title='SAPI Type'>
            {span.getIn(['data', 'php', 'sapi'])}
          </DescriptionItem>
          <DescriptionItem title='PHP Version'>
            {span.getIn(['data', 'php', 'version'])}
          </DescriptionItem>
          <DescriptionItem title='Host Header'>
            {span.getIn(['data', 'http', 'host'])}
          </DescriptionItem>
          <DescriptionItem title='Request URI'>
            {span.getIn(['data', 'http', 'url'])}
          </DescriptionItem>
          <DescriptionItem title='Request Method'>
            {span.getIn(['data', 'http', 'method'])}
          </DescriptionItem>
          <DescriptionItem title='HTTP Status Code'>
            {span.getIn(['data', 'http', 'status'], span.getIn(['data', 'http', 'status_code']))}
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
