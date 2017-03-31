import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Version">
        {snapshot.getIn(['data', 'version'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
