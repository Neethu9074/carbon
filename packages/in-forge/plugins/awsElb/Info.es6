import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="DNS name">{data.get('dns_name')}</DescriptionItem>
      <DescriptionItem title="ARN">{data.get('load_balancer_arn')}</DescriptionItem>
      <DescriptionItem title="Type">{data.get('type')}</DescriptionItem>
      <DescriptionItem title="Status">{data.get('state')}</DescriptionItem>
      <DescriptionItem title="Created at">{formatDateTime(data.get('created_time'))}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('aws_grouping_zone')}</DescriptionItem>
      <DescriptionItem title="Canonical hosted zone id">{data.get('canonical_hosted_zone_id')}</DescriptionItem>
      <DescriptionItem title="Scheme">{data.get('scheme')}</DescriptionItem>
      <DescriptionItem title="VPC id">{data.get('vpc_id')}</DescriptionItem>
      <DescriptionItem title="Ip address type">{data.get('ip_address_type')}</DescriptionItem>
    </DescriptionList>
  );
}
