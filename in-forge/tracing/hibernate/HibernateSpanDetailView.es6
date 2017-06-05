import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function HibernateSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Mode">
        {span.getIn(['data', 'hibernate', 'mode'])}
      </DescriptionItem>
      <DescriptionItem title="ID">
        {span.getIn(['data', 'hibernate', 'id'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
