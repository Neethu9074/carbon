import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function PageResourceRequestSpanDetailView({span}) {
  return (
    <DescriptionList>
      <DescriptionItem title='URL'>
        <a href={span.getIn(['data', 'page_res', 'url'])}
           target='_blank'
           rel='noopener noreferrer'>
          {span.getIn(['data', 'page_res', 'url'])}
        </a>
      </DescriptionItem>

      <DescriptionItem title='Initiator'>
        {span.getIn(['data', 'page_res', 'initiator'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
