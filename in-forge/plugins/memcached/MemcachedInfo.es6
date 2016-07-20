import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';

export default function MemcachedInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Port'>
        {data.get('port')}
      </DescriptionItem>
      <DescriptionItem title='Started at'>
        {formatDateTime(data.get('started_at'))}
      </DescriptionItem>
      <DescriptionItem title='Limit maxbytes'>
        {data.get('limit_maxbytes')}
      </DescriptionItem>
      <DescriptionItem title='Max connections'>
        {data.get('max_connections')}
      </DescriptionItem>
    </DescriptionList>
  );
}

MemcachedInfo.propTypes = {
  snapshot: irpt.map.isRequired
};
