import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function ModeInfo({snapshot}) {
  const version = snapshot.getIn(['data', 'version']);

  if (version) {
    return (
      <DescriptionList>
        <DescriptionItem title='Mode'>
          Standalone
        </DescriptionItem>
      </DescriptionList>
    );
  }

  return (
    <DescriptionList>
      <DescriptionItem title='Mode'>
        Replicated
      </DescriptionItem>
    </DescriptionList>
  );
}
