import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Pid">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Name">{data.get('cluster_name')}</DescriptionItem>
      <DescriptionItem title="Id">{data.get('fsid')}</DescriptionItem>
    </DescriptionList>
  );
}
