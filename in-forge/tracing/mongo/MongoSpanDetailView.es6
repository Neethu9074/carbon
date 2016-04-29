import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function MongoSpanDetailView({span}) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Service'>
          {span.getIn(['data', 'mongo', 'service'])}
        </DescriptionItem>
        <DescriptionItem title='Topic'>
          {span.getIn(['data', 'mongo', 'protocol'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
