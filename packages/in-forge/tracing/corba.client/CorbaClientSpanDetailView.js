import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function CorbaClientSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Method">{span.getIn(['data', 'corba', 'method'])}</DescriptionItem>
        <DescriptionItem title="ORB">{span.getIn(['data', 'corba', 'orb'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
