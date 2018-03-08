import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function KinesisSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Record">{span.getIn(['data', 'kinesis', 'record'])}</DescriptionItem>
        <DescriptionItem title="Error">{span.getIn(['data', 'kinesis', 'error'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
