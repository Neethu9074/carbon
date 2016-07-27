import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function HttpSpanDetailView({span}) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='URL'>
          {span.getIn(['data', 'http', 'url'])}
        </DescriptionItem>
        <DescriptionItem title='Method'>
          {span.getIn(['data', 'http', 'method'])}
        </DescriptionItem>
        <DescriptionItem title='Status Code'>
          {span.getIn(['data', 'http', 'status'], span.getIn(['data', 'http', 'status_code']))}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
