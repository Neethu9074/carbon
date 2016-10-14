import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function Backends({snapshot, backend}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Host'>
        {data.get('backends').get(backend).get('host')}
      </DescriptionItem>
      <DescriptionItem title='Port'>
        {data.get('backends').get(backend).get('port')}
      </DescriptionItem>
    </DescriptionList>
  );
}
