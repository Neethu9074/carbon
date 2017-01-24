import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function RenderSpanDetailView({span}) {
  return (
    <DescriptionList>
      <DescriptionItem title='Type'>
        {span.getIn(['data', 'render', 'type'])}
      </DescriptionItem>
      <DescriptionItem title='Name'>
        {span.getIn(['data', 'render', 'name'])}
      </DescriptionItem>
      <DescriptionItem title='Error Message'>
        {span.getIn(['data', 'log', 'message'])}
      </DescriptionItem>
      <DescriptionItem title='Error Type'>
        {span.getIn(['data', 'log', 'parameters'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
