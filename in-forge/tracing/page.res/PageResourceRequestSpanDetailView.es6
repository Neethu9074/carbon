import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function PageResourceRequestSpanDetailView({span}) {
  return (
    <DescriptionList>
      <DescriptionItem title='URL'>
        {span.getIn(['data', 'page_res', 'url'])}
      </DescriptionItem>

      <DescriptionItem title='Initiator'>
        {span.getIn(['data', 'page_res', 'initiator'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
