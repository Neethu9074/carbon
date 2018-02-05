import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function NomadInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Host">{data.get('host')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
    </DescriptionList>
  );
}
