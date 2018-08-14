import React from 'react';

import Code from 'in-sdk/components/traceDetails/Code';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function JaegerSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Service">{span.getIn(['data', 'service'])}</DescriptionItem>
        <DescriptionItem title="Operation">{span.getIn(['data', 'operation'])}</DescriptionItem>
        <DescriptionItem title="Tags">
          <Code code={JSON.stringify(span.getIn(['data', 'tags']).toJS(), 0, 2)} lang="json" />
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
