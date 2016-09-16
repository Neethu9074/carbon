import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function PageRequestSpanDetailView({span}) {
  return (
    <DescriptionList>
      <DescriptionItem title='URL'>
        {span.getIn(['data', 'page', 'url'])}
      </DescriptionItem>

      <DescriptionItem title='Platform'>
        {span.getIn(['data', 'page', 'platform'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
