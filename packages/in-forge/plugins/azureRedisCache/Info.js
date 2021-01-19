/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';

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
        <DescriptionItem title="Version">{data.get('redisVersion')}</DescriptionItem>
        <DescriptionItem title="Host Name">{data.get('hostName')}</DescriptionItem>
        <DescriptionItem title="Port">
          {' '}
          {data.get('port')} {data.get('enableNonSslPort') ? '(Enabled)' : '(Disabled)'}
        </DescriptionItem>
        <DescriptionItem title="SSL Port">{data.get('sslPort')}</DescriptionItem>
        <DescriptionItem title="SKU">{data.get('sku')}</DescriptionItem>
        <DescriptionItem title="Max Clients">{data.get('maxClients')}</DescriptionItem>
        {data.get('maxmemoryReserved') != 0 && (
          <DescriptionItem title="Max Memory">{bytesTwoDecimalPlaces(data.get('maxmemoryReserved'))}</DescriptionItem>
        )}
        {data.get('maxFragmentationmemoryReserved') != 0 && (
          <DescriptionItem title="Max Fragmentation Memory">
            {bytesTwoDecimalPlaces(data.get('maxFragmentationmemoryReserved'))}
          </DescriptionItem>
        )}

        {data.get('maxmemoryDelta') != 0 && (
          <DescriptionItem title="Memory Delta">{bytesTwoDecimalPlaces(data.get('maxmemoryDelta'))}</DescriptionItem>
        )}
        <DescriptionItem title="Static IP">{data.get('staticIP')}</DescriptionItem>
        <DescriptionItem title="Subnet ID">{data.get('subnetId')}</DescriptionItem>
        <DescriptionItem title="Cluster Enabled">{data.get('shardCount') > 0 ? 'Yes' : 'No'}</DescriptionItem>
        {data.get('shardCount') > 0 && <DescriptionItem title="Shard Count">{data.get('shardCount')}</DescriptionItem>}
      </DescriptionList>
    </div>
  );
}
