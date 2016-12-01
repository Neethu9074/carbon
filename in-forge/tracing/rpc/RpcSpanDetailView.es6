import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function HttpSpanDetailView({span}) {
  return (
    <DescriptionList>
      <DescriptionItem title='Call'>
        {span.getIn(['data', 'rpc', 'call'])}
      </DescriptionItem>
      <DescriptionItem title='Host'>
        {span.getIn(['data', 'rpc', 'host'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
