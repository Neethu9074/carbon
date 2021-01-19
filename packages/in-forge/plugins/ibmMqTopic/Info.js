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
      <DescriptionItem title="Name">{data.get('topicName')}</DescriptionItem>
      <DescriptionItem title="Queue Manager">{data.get('qmName')}</DescriptionItem>
      <DescriptionItem title="Cluster Name">{data.get('clusterName')}</DescriptionItem>
      <DescriptionItem title="Topic Type">{data.get('topicType')}</DescriptionItem>
      <DescriptionItem title="Topic Alternated At">{data.get('topicAlternatedAt')}</DescriptionItem>
    </DescriptionList>
  );
}
