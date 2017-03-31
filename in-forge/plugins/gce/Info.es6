import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Instance ID">
          {data.get('instance-id')}
        </DescriptionItem>

        <DescriptionItem title="Type">
          {data.get('instance-type')}
        </DescriptionItem>

        <DescriptionItem title="Availability Zone">
          {data.get('availability-zone')}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
