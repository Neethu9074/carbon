import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function ClickHouseInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Host">{data.get('host')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Clusters">{data.get('clusters', emptyList).join(', ')}</DescriptionItem>
      <DescriptionItem title="HTTP Port">{data.get('http_port')}</DescriptionItem>
      <DescriptionItem title="TCP Port">{data.get('tcp_port')}</DescriptionItem>
      <DescriptionItem title="Server Log">{data.get('log')}</DescriptionItem>
      <DescriptionItem title="Error Log">{data.get('errorlog')}</DescriptionItem>
    </DescriptionList>
  );
}
