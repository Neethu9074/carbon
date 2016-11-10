import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function ModeInfo({snapshot}) {
  const version = snapshot.getIn(['data', 'version']);
  return (
    <DescriptionList>
      <DescriptionItem title='Mode'>
        {version ? 'Standalone' : 'Replicated'}
      </DescriptionItem>
    </DescriptionList>
  );
}
