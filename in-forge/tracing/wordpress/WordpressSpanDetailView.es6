import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function WordpressSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Action">{span.getIn(['data', 'wp', 'action'])}</DescriptionItem>
        <DescriptionItem title="Template">{span.getIn(['data', 'wp', 'view'])}</DescriptionItem>
        <DescriptionItem title="Post Title">{span.getIn(['data', 'wp', 'post_title'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
