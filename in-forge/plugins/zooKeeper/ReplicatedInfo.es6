import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';

export default function ReplicatedInfo({snapshot, peer}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Address'>
        {data.get('quorum.' + peer + '.address')}
      </DescriptionItem>
      <DescriptionItem title='Started At'>
        {formatDateTime(data.get('quorum.' + peer + '.started_at'))}
      </DescriptionItem>
      <DescriptionItem title='State'>
        {data.get('quorum.' + peer + '.state')}
      </DescriptionItem>
    </DescriptionList>
  );
}
