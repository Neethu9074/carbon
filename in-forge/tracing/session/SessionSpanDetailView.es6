import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function SessionSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Session Handler">
          {span.getIn(['data', 'session', 'save_handler'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
