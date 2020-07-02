import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Id">{data.get('id')}</DescriptionItem>
      <DescriptionItem title="Project Number">{data.get('projectNumber')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('gceZone')}</DescriptionItem>
      <DescriptionItem title="Location Type">{data.get('locationType')}</DescriptionItem>
      <DescriptionItem title="Storage Class">{data.get('storageClass')}</DescriptionItem>
      <DescriptionItem title="Created At">{data.get('created')}</DescriptionItem>
      <DescriptionItem title="Updated At">{data.get('updated')}</DescriptionItem>
    </DescriptionList>
  );
}
