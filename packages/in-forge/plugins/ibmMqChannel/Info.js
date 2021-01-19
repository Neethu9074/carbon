/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('channelName')}</DescriptionItem>
      <DescriptionItem title="Status">{data.get('channelStatus')}</DescriptionItem>
      <DescriptionItem title="In Doubt">{data.get('channelInDoubt')}</DescriptionItem>
      <DescriptionItem title="Substate">{data.get('channelSubStatus')}</DescriptionItem>
      <DescriptionItem title="Connection Name">{data.get('connectionName')}</DescriptionItem>
      <DescriptionItem title="Remote Queue Manager">{data.get('remoteQM')}</DescriptionItem>
      <DescriptionItem title="Last Message Date/Time">{data.get('lastMessage')}</DescriptionItem>
      <DescriptionItem title="Start Date/Time">{data.get('startDateTime')}</DescriptionItem>
    </DescriptionList>
  );
}
