import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('qmName')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Status">{data.get('status')}</DescriptionItem>
      <DescriptionItem title="Started At">{data.get('startDate')}</DescriptionItem>
      <DescriptionItem title="Alternated At">{data.get('alternatedDate')}</DescriptionItem>
      <DescriptionItem title="Platform">{data.get('platform')}</DescriptionItem>
      <DescriptionItem title="Location">{data.get('location')}</DescriptionItem>
      <DescriptionItem title="Description">{data.get('description')}</DescriptionItem>
      <DescriptionItem title="Command Level">{data.get('commandLevel')}</DescriptionItem>
      <DescriptionItem title="Repo">{data.get('repository')}</DescriptionItem>
      <DescriptionItem title="Max Handles">{data.get('maxHandles')}</DescriptionItem>
    </DescriptionList>
  );
}
