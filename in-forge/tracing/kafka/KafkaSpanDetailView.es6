import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function KafkaSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Access Type">
          {span.getIn(['data', 'kafka', 'access'])}
        </DescriptionItem>
        <DescriptionItem title="Topic">
          {span.getIn(['data', 'kafka', 'service'])}
        </DescriptionItem>
        <DescriptionItem title="Error">
          {span.getIn(['data', 'kafka', 'error'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
