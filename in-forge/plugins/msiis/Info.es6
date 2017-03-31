import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function IISInfo({ snapshot }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Version">
        {snapshot.getIn(['data', 'iis.version'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
