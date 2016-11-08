import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function JmsSpanDetailView({span}) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Destination'>
          {span.getIn(['data', 'jms', 'destination'])}
        </DescriptionItem>
        <DescriptionItem title='Message'>
          {span.getIn(['data', 'jms', 'message'])}
        </DescriptionItem>
        <DescriptionItem title='Type'>
          {span.getIn(['data', 'jms', 'type'])}
        </DescriptionItem>
        <DescriptionItem title='Selector'>
          {span.getIn(['data', 'jms', 'selector'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
