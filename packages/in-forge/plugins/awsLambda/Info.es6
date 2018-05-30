import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="ARN">{data.get('arn')}</DescriptionItem>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Description">{data.get('description')}</DescriptionItem>
      <DescriptionItem title="Runtime">{data.get('runtime')}</DescriptionItem>
      <DescriptionItem title="Handler">{data.get('handler')}</DescriptionItem>
      <DescriptionItem title="Timeout">{data.get('timeout')}</DescriptionItem>
      <DescriptionItem title="Memory Size">{data.get('memory_size')}</DescriptionItem>
      <DescriptionItem title="Last Modified">{data.get('last_modified')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('aws_grouping_zone')}</DescriptionItem>
    </DescriptionList>
  );
}
