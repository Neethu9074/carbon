import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function NomadInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Nomad Version">{data.get('nomad_version')}</DescriptionItem>
    </DescriptionList>
  );
}
