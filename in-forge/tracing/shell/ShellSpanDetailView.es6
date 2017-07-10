import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function ShellSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Shell Command">
        {span.getIn(['data', 'shell', 'cmd'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
