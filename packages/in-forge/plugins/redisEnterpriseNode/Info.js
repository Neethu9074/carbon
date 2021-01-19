/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';

const bytesTwoDecimalPlacesPositiveFormatter = d => (d > 0 ? bytesTwoDecimalPlaces(d) : '-');

export default function RedisInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Address">{data.get('addr')}</DescriptionItem>
      <DescriptionItem title="Status">{data.get('status')}</DescriptionItem>
      <DescriptionItem title="Operating System">{data.get('osName')}</DescriptionItem>
      <DescriptionItem title="Shard Count">{data.get('shardCount')}</DescriptionItem>
      <DescriptionItem title="Cores">{data.get('cores')}</DescriptionItem>
      <DescriptionItem title="Total Memory">
        {bytesTwoDecimalPlacesPositiveFormatter(data.get('totalMemory'))}
      </DescriptionItem>
      <DescriptionItem title="Cluster Name">{data.get('clusterName')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
