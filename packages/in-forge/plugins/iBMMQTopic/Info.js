import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('topicName')}</DescriptionItem>
      <DescriptionItem title="Application">{data.get('qmName')}</DescriptionItem>
      <DescriptionItem title="Channel">{data.get('clusterName')}</DescriptionItem>
      <DescriptionItem title="Connection">{data.get('topicType')}</DescriptionItem>
      <DescriptionItem title="Input Type">{data.get('topicAlternatedAt')}</DescriptionItem>
    </DescriptionList>
  );
}
