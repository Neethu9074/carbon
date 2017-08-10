import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function CassandraCommunicationInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Node State">
        {data.get('mode')}
      </DescriptionItem>

      <DescriptionItem title="Gossip Running">
        {data.get('gossipRunning')}
      </DescriptionItem>

      <DescriptionItem title="Thrift Running">
        {data.get('thriftRunning')}
      </DescriptionItem>

      <DescriptionItem title="CQL/Native Transport Running">
        {data.get('nativeTransportRunning')}
      </DescriptionItem>

    </DescriptionList>
  );
}
