import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function AkkaRemoteSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Path">{span.getIn(['data', 'akka', 'path'])}</DescriptionItem>
      <DescriptionItem title="Message">{span.getIn(['data', 'akka', 'msg'])}</DescriptionItem>
    </DescriptionList>
  );
}
