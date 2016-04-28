import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function EJBSpanDetailView({span}) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Method'>
          {span.getIn(['data', 'ejb', 'method'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
