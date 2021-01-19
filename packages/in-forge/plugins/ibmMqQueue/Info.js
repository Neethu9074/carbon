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
      <DescriptionItem title="Type">{data.get('queueType')}</DescriptionItem>
      <DescriptionItem title="Created At">{data.get('queueCreated')}</DescriptionItem>
      <DescriptionItem title="Alternated At">{data.get('queueAlternated')}</DescriptionItem>
      <DescriptionItem title="Inhibit Put">{data.get('inhibitPut')}</DescriptionItem>
      <DescriptionItem title="Inhibit Get">{data.get('inhibitGet')}</DescriptionItem>
      <DescriptionItem title="Delivery Sequence">{data.get('queueDelivery')}</DescriptionItem>
      <DescriptionItem title="Default Binding">{data.get('queueDefaultBinding')}</DescriptionItem>
      <DescriptionItem title="Usage">{data.get('queueUsage')}</DescriptionItem>
      <DescriptionItem title="Monitoring">{data.get('queueMonitoring')}</DescriptionItem>
    </DescriptionList>
  );
}
