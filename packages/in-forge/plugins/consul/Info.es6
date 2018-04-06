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
        <DescriptionItem title="State">{data.get('agent.self.stats.raft.state')}</DescriptionItem>
        <DescriptionItem title="Leader">{data.get('agent.status.leader')}</DescriptionItem>
        <DescriptionItem title="Peers">{data.get('agent.status.peers')}</DescriptionItem>
      </DescriptionList>

      <Separator />

      <Collapsible>
        <Collapsible.Header>Details</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="Datacenter">{data.get('agent.self.config.datacenter')}</DescriptionItem>
            <DescriptionItem title="Node ID">{data.get('agent.self.config.nodeID')}</DescriptionItem>
            <DescriptionItem title="AdvertiseAddr">{data.get('agent.self.config.advertiseAddr')}</DescriptionItem>
            <DescriptionItem title="Domain">{data.get('agent.self.config.domain')}</DescriptionItem>
            <DescriptionItem title="Log Level">{data.get('agent.self.config.logLevel')}</DescriptionItem>
            <DescriptionItem title="Build Revision">{data.get('agent.self.stats.build.revision')}</DescriptionItem>
            <DescriptionItem title="Build Version">{data.get('agent.self.stats.build.version')}</DescriptionItem>
            <DescriptionItem title="Protocol Version">
              {data.get('agent.self.stats.raft.protocolVersion')}
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
