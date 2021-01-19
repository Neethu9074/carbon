/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="ARN">{data.get('load_balancer_arn')}</DescriptionItem>
      <DescriptionItem title="DNS name">{data.get('dns_name')}</DescriptionItem>
      <DescriptionItem title="Type">{data.get('type')}</DescriptionItem>
      <DescriptionItem title="Status">{data.get('state')}</DescriptionItem>
      <DescriptionItem title="Scheme">{data.get('scheme')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('aws_grouping_zone')}</DescriptionItem>
      <DescriptionItem title="Creation time">{formatDateTime(data.get('created_time'))}</DescriptionItem>
      <DescriptionItem title="Hosted zone">{data.get('canonical_hosted_zone_id')}</DescriptionItem>
      <DescriptionItem title="VPC">{data.get('vpc_id')}</DescriptionItem>
      <DescriptionItem title="Ip address type">{data.get('ip_address_type')}</DescriptionItem>
    </DescriptionList>
  );
}
