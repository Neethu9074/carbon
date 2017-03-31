import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { SpanTabs, SpanTab } from 'in-components/SpanTabs';
import StackTrace from 'in-components/StackTrace';

export default function SpringBatchSpanDetailView({ span }) {
  const stackTrace = span.get('stackTrace');

  return (
    <SpanTabs>
      <SpanTab title="Overview">
        <DescriptionList>
          <DescriptionItem title="Job">
            {span.getIn(['data', 'batch', 'job'])}
          </DescriptionItem>
          <DescriptionItem title="Parameters">
            {span.getIn(['data', 'batch', 'parameters'])}
          </DescriptionItem>
          <DescriptionItem title="Exit Status">
            {span.getIn(['data', 'batch', 'status'])}
          </DescriptionItem>
        </DescriptionList>
      </SpanTab>

      {stackTrace && stackTrace.size > 0
        ? <SpanTab title="Stack Trace">
            <StackTrace stackTrace={stackTrace} />
          </SpanTab>
        : null}
    </SpanTabs>
  );
}
