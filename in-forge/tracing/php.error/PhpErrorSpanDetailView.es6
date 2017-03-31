import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function PhpErrorSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Message">
          {span.getIn(['data', 'error', 'msg'])}
        </DescriptionItem>
        <DescriptionItem title="Class">
          {span.getIn(['data', 'error', 'class'])}
        </DescriptionItem>
        <DescriptionItem title="Function/Method">
          {span.getIn(['data', 'error', 'function'])}
        </DescriptionItem>
        <DescriptionItem title="Type">
          {span.getIn(['data', 'error', 'type'])}
        </DescriptionItem>
        <DescriptionItem title="File">
          {span.getIn(['data', 'error', 'file'])}
        </DescriptionItem>
        <DescriptionItem title="Line">
          {span.getIn(['data', 'error', 'line'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
