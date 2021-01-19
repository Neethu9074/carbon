/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <Collapsible initiallyOpen>
      <Collapsible.Header>Info</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
          <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
          <DescriptionItem title="Start Time">{data.get('startTime')}</DescriptionItem>
          <DescriptionItem title="Initialised">{yesOrNo(data.get('initialised'))}</DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
