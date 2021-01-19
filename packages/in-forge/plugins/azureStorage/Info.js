/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
        <DescriptionItem title="Resource Group">{data.get('resourceGroup')}</DescriptionItem>
        <DescriptionItem title="Location">{data.get('location')}</DescriptionItem>
        <DescriptionItem title="Region">{data.get('region')}</DescriptionItem>
        <DescriptionItem title="Subscription ID">{data.get('subscription')}</DescriptionItem>
        <DescriptionItem title="Type">{data.get('type')}</DescriptionItem>
        <DescriptionItem title="Kind">{data.get('kind')}</DescriptionItem>
        <DescriptionItem title="State">{data.get('provisioningState')}</DescriptionItem>
        <DescriptionItem title="Access Tier">{data.get('accessTier')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
