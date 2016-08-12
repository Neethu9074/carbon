import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function LogSpanDetailView({span}) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Parameters'>
          {span.getIn(['data', 'log', 'parameters'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
