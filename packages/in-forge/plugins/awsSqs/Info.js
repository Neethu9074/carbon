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
      <DescriptionItem title="Endpoint">{data.get('endpoint_address')}</DescriptionItem>
      <DescriptionItem title="ARN">{data.get('queue_arn')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('aws_region')}</DescriptionItem>
      <DescriptionItem title="Created At">{formatDateTime(data.get('created_at'))}</DescriptionItem>
      <DescriptionItem title="Message Retention Period">{data.get('msg_retention_period')}</DescriptionItem>
      <DescriptionItem title="Max Message Size">{data.get('max_msg_size')}</DescriptionItem>
      <DescriptionItem title="Visibility Timeout">{data.get('visibilty_timeout')}</DescriptionItem>
      <DescriptionItem title="Last Modified">{formatDateTime(data.get('last_modified'))}</DescriptionItem>
    </DescriptionList>
  );
}
