/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';
import { formatDateTime } from 'in-services/formatters/date';

import HostLink from './Dashboard/HostLink';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Volume ID">{data.get('volume_id')}</DescriptionItem>
      <DescriptionItem title="Created at">{formatDateTime(data.get('creation_time'))}</DescriptionItem>
      <DescriptionItem title="State">{data.get('state')}</DescriptionItem>
      <DescriptionItem title="Size">{bytesZeroDecimalPlaces(data.get('size'))}</DescriptionItem>
      <DescriptionItem title="Type">{data.get('type')}</DescriptionItem>
      <DescriptionItem title="IOPS">{data.get('iops')}</DescriptionItem>
      <DescriptionItem title="Encrypted">{yesOrNo(data.get('encrypted'))}</DescriptionItem>
      <DescriptionItem title="Mounted Instance ID">{data.get('mounted_instance_id')}</DescriptionItem>
      <DescriptionItem title="Mounted Path">{data.get('mounted_path')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('aws_grouping_zone')}</DescriptionItem>
      <HostLink snapshot={snapshot} />
    </DescriptionList>
  );
}
