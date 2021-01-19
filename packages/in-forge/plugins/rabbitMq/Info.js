/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function RabbitMqInfo({ snapshot }) {
  const data = snapshot.get('data');
  const nodeNames = data.get('nodes', emptyList);
  const channelNames = data.get('channels', emptyList);

  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Ports">{data.get('overview.ports', emptyList).join(', ')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('overview.version')}</DescriptionItem>
      <DescriptionItem title="Erlang version">{data.get('overview.erlang_version')}</DescriptionItem>
      <DescriptionItem title="Node">{data.get('overview.node')}</DescriptionItem>
      <DescriptionItem title="Nodes">{nodeNames.size}</DescriptionItem>
      <DescriptionItem title="Channels">{channelNames.size}</DescriptionItem>
    </DescriptionList>
  );
}
