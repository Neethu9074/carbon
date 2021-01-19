/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import TagList from 'in-sdk/components/sidebar/TagList';
export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
        <DescriptionItem title="Resource Group">{data.get('resourceGroup')}</DescriptionItem>
        <DescriptionItem title="Location">{data.get('location')}</DescriptionItem>
        <DescriptionItem title="Subscription ID">{data.get('subscription')}</DescriptionItem>
        <DescriptionItem title="Type">{data.get('type')}</DescriptionItem>
        <DescriptionItem title="Maximum Size">{bytesTwoDecimalPlaces(data.get('maxSizeBytes'))}</DescriptionItem>
        <DescriptionItem title="Status">{data.get('status')}</DescriptionItem>
        <DescriptionItem title="Zone Redundant">{data.get('zoneRedundant') ? 'Yes' : 'No'}</DescriptionItem>
        <DescriptionItem title="SKU">{data.get('sku')}</DescriptionItem>
        <TagList snapshot={snapshot} />
      </DescriptionList>
    </div>
  );
}
