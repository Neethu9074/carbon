/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="ARN">{data.get('broker_arn')}</DescriptionItem>
      <DescriptionItem title="Broker Name">{data.get('broker_name')}</DescriptionItem>
      <DescriptionItem title="State">{data.get('broker_state')}</DescriptionItem>
      <DescriptionItem title="Created At">{formatDateTime(data.get('created_at'))}</DescriptionItem>
      <DescriptionItem title="Engine Type">{data.get('engine_type')}</DescriptionItem>
      <DescriptionItem title="Engine Version">{data.get('engine_version')}</DescriptionItem>
      <DescriptionItem title="Instance Type">{data.get('instance_type')}</DescriptionItem>
      <DescriptionItem title="Deployment">{data.get('deployment')}</DescriptionItem>
      <DescriptionItem title="Public Accessibility">{yesOrNo(data.get('public_accessibility'))}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('aws_grouping_zone')}</DescriptionItem>
    </DescriptionList>
  );
}
