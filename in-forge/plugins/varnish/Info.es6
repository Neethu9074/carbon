import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function VarnishInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Port'>
        {data.get('port')}
      </DescriptionItem>
    </DescriptionList>
  );
}
