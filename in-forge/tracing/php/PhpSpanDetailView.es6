import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';

export default function HttpSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="SAPI Type">
          {span.getIn(['data', 'php', 'sapi'])}
        </DescriptionItem>
        <DescriptionItem title="PHP Version">
          {span.getIn(['data', 'php', 'version'])}
        </DescriptionItem>
        <DescriptionItem title="Host Header">
          {span.getIn(['data', 'http', 'host'])}
        </DescriptionItem>
        <DescriptionItem title="Remote Address">
          {span.getIn(['data', 'peer', 'ip'])}
        </DescriptionItem>
        <DescriptionItem title="Request URI">
          {span.getIn(['data', 'http', 'url'])}
        </DescriptionItem>
        <DescriptionItem title="Request Method">
          {span.getIn(['data', 'http', 'method'])}
        </DescriptionItem>
        <DescriptionItem title="HTTP Status Code">
          {span.getIn(['data', 'http', 'status'], span.getIn(['data', 'http', 'status_code']))}
        </DescriptionItem>
        {getCustomHeaders(span)}
      </DescriptionList>
    </div>
  );
}
function getCustomHeaders(span) {
  return span
    .getIn(['data', 'http', 'header'], emptyMap)
    .map((v, k) => {
      return (
        <DescriptionItem title={`Header: ${k}`} key={`header-${k}`}>
          {v}
        </DescriptionItem>
      );
    })
    .valueSeq()
    .toArray();
}
