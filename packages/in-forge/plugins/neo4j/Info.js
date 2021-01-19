/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Neo4jInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Database name">{data.get('databaseName')}</DescriptionItem>
      <DescriptionItem title="Store ID">{data.get('storeId')}</DescriptionItem>
      <DescriptionItem title="Store Directory">{data.get('storeDirectory')}</DescriptionItem>
      <DescriptionItem title="Bolt listen address">{data.get('boltAddress')}</DescriptionItem>
      <DescriptionItem title="HTTP listen address">{data.get('httpAddress')}</DescriptionItem>
      <DescriptionItem title="HTTPS listen address">{data.get('httpsAddress')}</DescriptionItem>
    </DescriptionList>
  );
}
