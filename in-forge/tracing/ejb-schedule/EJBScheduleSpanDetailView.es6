import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function GlassfishSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Scheduled Task">
          {span.getIn(['data', 'ejb', 'schedule', 'id'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
