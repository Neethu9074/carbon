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
      <DescriptionItem title="Name">{data.get('queueName')}</DescriptionItem>
      <DescriptionItem title="Application">{data.get('application')}</DescriptionItem>
      <DescriptionItem title="Channel">{data.get('channel')}</DescriptionItem>
      <DescriptionItem title="Connection">{data.get('connection')}</DescriptionItem>
      <DescriptionItem title="Input Type">{data.get('inputType')}</DescriptionItem>
      <DescriptionItem title="Output">{data.get('output')}</DescriptionItem>
      <DescriptionItem title="Inquire">{data.get('inquire')}</DescriptionItem>
      <DescriptionItem title="Set">{data.get('set')}</DescriptionItem>
      <DescriptionItem title="Browse">{data.get('browse')}</DescriptionItem>
      <DescriptionItem title="Last Message At">{data.get('lastMessageAt')}</DescriptionItem>
      <DescriptionItem title="Handle State">{data.get('handleState')}</DescriptionItem>
      <DescriptionItem title="User">{data.get('user')}</DescriptionItem>
    </DescriptionList>
  );
}
