/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { positiveNumber } from 'in-services/formatters/number';

export default function HAProxyInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Version">{data.get('info.version')}</DescriptionItem>
      <DescriptionItem title="Name">{data.get('info.name')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Max Memory">{positiveNumber(data.get('info.memmax'))}</DescriptionItem>
      <DescriptionItem title="Max File Descriptors">{positiveNumber(data.get('info.ulimitN'))}</DescriptionItem>
      <DescriptionItem title="Max Sockets">{positiveNumber(data.get('info.maxsock'))}</DescriptionItem>
      <DescriptionItem title="Max Connections">{positiveNumber(data.get('info.maxconn'))}</DescriptionItem>
      <DescriptionItem title="Max pipes">{positiveNumber(data.get('info.maxpipes'))}</DescriptionItem>
      <DescriptionItem title="Session Rate Limit">{positiveNumber(data.get('info.sessRateLimit'))}</DescriptionItem>
    </DescriptionList>
  );
}
