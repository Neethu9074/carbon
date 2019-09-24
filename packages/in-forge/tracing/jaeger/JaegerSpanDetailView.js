import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { emptyMap } from 'in-services/fixedImmutables';

export default function JaegerSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Service">{span.getIn(['data', 'service'])}</DescriptionItem>
        <DescriptionItem title="Operation">{span.getIn(['data', 'operation'])}</DescriptionItem>
        <DescriptionItem title="Tags" verticalDisplay>
          <Code code={JSON.stringify(span.getIn(['data', 'tags'], emptyMap).toJS(), 0, 2)} lang="json" />
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
