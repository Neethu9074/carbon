import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function HttpSpanDetailView({span}) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Host'>
          {span.getIn(['data', 'http', 'host'])}
        </DescriptionItem>
        <DescriptionItem title='URL'>
          {span.getIn(['data', 'http', 'url'])}
        </DescriptionItem>
        <DescriptionItem title='Method'>
          {span.getIn(['data', 'http', 'method'])}
        </DescriptionItem>
        <DescriptionItem title='Status Code'>
          {span.getIn(['data', 'http', 'status'])}
        </DescriptionItem>
        <DescriptionItem title='Content Length'>
          {span.getIn(['data', 'http', 'size'], span.getIn(['data', 'net', 'in']))}
        </DescriptionItem>
        <DescriptionItem title='Request Header Length'>
          {span.getIn(['data', 'net', 'out'])}
        </DescriptionItem>
        <DescriptionItem title='Remote Address'>
          {span.getIn(['data', 'peer', 'ip'])}
        </DescriptionItem>
        <DescriptionItem title='Remote Port'>
          {span.getIn(['data', 'peer', 'port'])}
        </DescriptionItem>
        <DescriptionItem title='Error'>
          {span.getIn(['data', 'http', 'error'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
