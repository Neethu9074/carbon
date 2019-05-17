import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function LiferayInfo({ snapshot }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Version">{snapshot.getIn(['data', 'version'])}</DescriptionItem>
    </DescriptionList>
  );
}
