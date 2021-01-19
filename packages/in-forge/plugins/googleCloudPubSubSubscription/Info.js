/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { emptyMap } from 'in-services/fixedImmutables';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const labels = data.get('labels', emptyMap);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Project ID">{data.get('projectId')}</DescriptionItem>
        <DescriptionItem title="Name">{data.get('subscriptionName')}</DescriptionItem>
        <DescriptionItem title="Topic Name">{data.get('topicName')}</DescriptionItem>
      </DescriptionList>
      {labels.size > 0 && <KeyValueOverlay header="Labels" data={labels} />}
    </div>
  );
}
