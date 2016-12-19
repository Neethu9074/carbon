import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {bytesTwoDecimalPlaces} from 'in-services/formatters/number';


export default function PageResourceRequestSpanDetailView({span}) {
  const encodedBodySize = span.getIn(['data', 'page_res', 'encodedBodySize']);
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

      {encodedBodySize ?
        <DescriptionItem title='Encoded Body Size'>
          {bytesTwoDecimalPlaces(encodedBodySize)}
        </DescriptionItem>
      : null}

      <DescriptionItem title='Cache Status'>
        {span.getIn(['data', 'page_res', 'caching'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
