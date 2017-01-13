import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function MemcacheSpanDetailView({span}) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Operation'>
          {span.getIn(['data', 'memcached', 'operation'])}
        </DescriptionItem>
        <DescriptionItem title='Key'>
          {span.getIn(['data', 'memcached', 'key'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
