import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function MemcacheSpanDetailView({span}) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Command'>
          {span.getIn(['data', 'memcache', 'command'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
