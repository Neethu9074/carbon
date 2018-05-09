import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function SnsSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Topic">{span.getIn(['data', 'sns', 'topic'])}</DescriptionItem>
        <DescriptionItem title="Target">{span.getIn(['data', 'sns', 'target'])}</DescriptionItem>
        <DescriptionItem title="Phone">{span.getIn(['data', 'sns', 'phone'])}</DescriptionItem>
        <DescriptionItem title="Subject">{span.getIn(['data', 'sns', 'subject'])}</DescriptionItem>
        <DescriptionItem title="Response Code">{span.getIn(['data', 'sns', 'responseCode'])}</DescriptionItem>
        <DescriptionItem title="Error">{span.getIn(['data', 'sns', 'error'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
