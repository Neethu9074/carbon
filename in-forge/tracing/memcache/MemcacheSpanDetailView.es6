import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function MemcacheSpanDetailView({ span }) {
  const command = span.getIn(['data', 'memcache', 'command']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Command">
          {command}
        </DescriptionItem>
        <DescriptionItem title="Key">
          {span.getIn(['data', 'memcache', 'key'])}
        </DescriptionItem>

        {command === 'get'
          ? <DescriptionItem title="Hit">
              {yesOrNo(span.getIn(['data', 'memcache', 'hit']) == 1)}
            </DescriptionItem>
          : null}

        <DescriptionItem title="Keys">
          {span.getIn(['data', 'memcache', 'keys'])}
        </DescriptionItem>
        <DescriptionItem title="Hit Count">
          {span.getIn(['data', 'memcache', 'hits'])}
        </DescriptionItem>
        <DescriptionItem title="Namespace">
          {span.getIn(['data', 'memcache', 'namespace'])}
        </DescriptionItem>
        <DescriptionItem title="Server">
          {span.getIn(['data', 'memcache', 'server'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
