import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Database">{data.get('db_name')}</DescriptionItem>
      <DescriptionItem title="Endpoint">{data.get('endpoint_address')}</DescriptionItem>
      <DescriptionItem title="Role">{data.get('role')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('endpoint_port')}</DescriptionItem>
      <DescriptionItem title="Hosted Zone">{data.get('endpoint_hosted_zone_id')}</DescriptionItem>
      <DescriptionItem title="Master User">{data.get('master_user')}</DescriptionItem>
      <DescriptionItem title="Availability Zone">{data.get('availability_zone')}</DescriptionItem>
      <DescriptionItem title="ARN">{data.get('db_instance_arn')}</DescriptionItem>
      <DescriptionItem title="Engine">{data.get('db_engine')}</DescriptionItem>
      <DescriptionItem title="Cluster">{data.get('db_cluster')}</DescriptionItem>
      <DescriptionItem title="Agent Host">{data.get('agent_host')}</DescriptionItem>
    </DescriptionList>
  );
}
