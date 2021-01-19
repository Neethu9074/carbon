/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { emptyMap } from 'in-services/fixedImmutables';

import EbsList from './EbsList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const tags = data.get('tags', emptyMap);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Public Hostname">{data.get('public-hostname')}</DescriptionItem>

        <DescriptionItem title="Instance ID">{data.get('instance-id')}</DescriptionItem>

        <DescriptionItem title="Type">{data.get('instance-type')}</DescriptionItem>

        <DescriptionItem title="Availability Zone">{data.get('availability-zone')}</DescriptionItem>

        <DescriptionItem title="Public IP">{data.get('public-ipv4')}</DescriptionItem>

        <DescriptionItem title="AMI ID">{data.get('ami-id')}</DescriptionItem>

        <DescriptionItem title="Reservation ID">{data.get('reservation-id')}</DescriptionItem>

        <DescriptionItem title="Security Groups">{data.get('security-groups', []).join(', ')}</DescriptionItem>

        <DescriptionItem title="Public Keys">{data.get('public-keys', []).join(', ')}</DescriptionItem>

        <DescriptionItem title="VPC">{data.get('vpc-ids', []).join(', ')}</DescriptionItem>
      </DescriptionList>

      {tags.size > 0 && <KeyValueOverlay header="Tags" data={tags} />}

      <EbsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
