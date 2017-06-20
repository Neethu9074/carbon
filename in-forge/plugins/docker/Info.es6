import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatDateTime, fromNow } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';

export default function DockerInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Image">
        {data.get('Image')}
      </DescriptionItem>
      <DescriptionItem title="Command">
        {data.get('Command')}
      </DescriptionItem>
      <DescriptionItem title="Created">
        {formatDateTime(data.get('Created'))} ({fromNow(data.get('Created'))})
      </DescriptionItem>
      <DescriptionItem title="Started">
        {formatDateTime(data.get('Started'))} ({fromNow(data.get('Started'))})
      </DescriptionItem>
      <DescriptionItem title="Id">
        {data.get('Id')}
      </DescriptionItem>
      <DescriptionItem title="Names">
        {data.get('Names', emptyList).join(', ')}
      </DescriptionItem>
      <DescriptionItem title="Network Mode">
        {data.get('NetworkMode')}
      </DescriptionItem>
      <DescriptionItem title="Storage Driver">
        {data.get('StorageDriver')}
      </DescriptionItem>
      <DescriptionItem title="Docker Version">
        {data.get('docker_version')}
      </DescriptionItem>
    </DescriptionList>
  );
}
