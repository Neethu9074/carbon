/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function KafkaConnectConnectorInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Connector Name">{data.get('connectorName')}</DescriptionItem>
      <DescriptionItem title="Connector Class">{data.get('connectorClass')}</DescriptionItem>
      <DescriptionItem title="Connector Type">{data.get('connectorType')}</DescriptionItem>
      <DescriptionItem title="Connector Version">{data.get('connectorVersion')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
