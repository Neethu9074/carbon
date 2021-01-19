/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function ConsulInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
        <DescriptionItem title="Node Name">{data.get('nodeName')}</DescriptionItem>
        <DescriptionItem title="Consul Version">{data.get('consul_version')}</DescriptionItem>
        <DescriptionItem title="State">{data.get('raft.state', 'Client')}</DescriptionItem>
        <DescriptionItem title="Leader">{data.get('leader')}</DescriptionItem>
        <DescriptionItem title="Peers">{data.get('peers')}</DescriptionItem>
        <DescriptionItem title="Datacenter">{data.get('datacenter')}</DescriptionItem>
        <DescriptionItem title="Catalog Datacenters">{data.get('catalog.datacenters')}</DescriptionItem>
        <DescriptionItem title="Node ID">{data.get('nodeID')}</DescriptionItem>
        <DescriptionItem title="Advertise Address">{data.get('advertiseAddr')}</DescriptionItem>
        <DescriptionItem title="Domain">{data.get('domain')}</DescriptionItem>
        <DescriptionItem title="Log Level">{data.get('logLevel')}</DescriptionItem>
        <DescriptionItem title="Build Revision">{data.get('revision')}</DescriptionItem>
        <DescriptionItem title="Build Version">{data.get('version')}</DescriptionItem>
        <DescriptionItem title="Protocol Version">{data.get('raft.protocolVersion')}</DescriptionItem>
        <DescriptionItem title="Last Contact">{data.get('raft.lastContact')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
