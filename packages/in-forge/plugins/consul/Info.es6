import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function ConsulInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
        <DescriptionItem title="Consul Version">{data.get('consul_version')}</DescriptionItem>
        <DescriptionItem title="State">{data.get('raft.state')}</DescriptionItem>
        <DescriptionItem title="Leader">{data.get('leader')}</DescriptionItem>
        <DescriptionItem title="Peers">{data.get('peers')}</DescriptionItem>
      </DescriptionList>

      <Separator />

      <Collapsible>
        <Collapsible.Header>Details</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="Datacenter">{data.get('datacenter')}</DescriptionItem>
            <DescriptionItem title="Node ID">{data.get('nodeID')}</DescriptionItem>
            <DescriptionItem title="AdvertiseAddr">{data.get('advertiseAddr')}</DescriptionItem>
            <DescriptionItem title="Domain">{data.get('domain')}</DescriptionItem>
            <DescriptionItem title="Log Level">{data.get('logLevel')}</DescriptionItem>
            <DescriptionItem title="Build Revision">{data.get('revision')}</DescriptionItem>
            <DescriptionItem title="Build Version">{data.get('version')}</DescriptionItem>
            <DescriptionItem title="Protocol Version">{data.get('raft.protocolVersion')}</DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
