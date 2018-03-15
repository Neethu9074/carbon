import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function KinesisSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Stream">{span.getIn(['data', 'kinesis', 'stream'])}</DescriptionItem>
        <DescriptionItem title="Operation">{span.getIn(['data', 'kinesis', 'op'])}</DescriptionItem>
        <DescriptionItem title="Record">{span.getIn(['data', 'kinesis', 'record'])}</DescriptionItem>
        <DescriptionItem title="Record">{span.getIn(['data', 'kinesis', 'record'])}</DescriptionItem>
        <DescriptionItem title="Error">{span.getIn(['data', 'kinesis', 'error'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
