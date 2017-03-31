import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function SpringbootInfo({ snapshot }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Dropwizard Version">
        {snapshot.getIn(['data', 'version'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
