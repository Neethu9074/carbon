import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="ARN">{data.get('arn')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('region')}</DescriptionItem>
    </DescriptionList>
  );
}
