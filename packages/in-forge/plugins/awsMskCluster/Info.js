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
      <DescriptionItem title="Name">{data.get('clusterName')}</DescriptionItem>
      <DescriptionItem title="ARN">{data.get('clusterArn')}</DescriptionItem>
      <DescriptionItem title="Enhanced Monitoring">{data.get('clusterEnhancedMonitoring')}</DescriptionItem>
      <DescriptionItem title="Kafka Version">{data.get('kafkaVersion')}</DescriptionItem>
    </DescriptionList>
  );
}
