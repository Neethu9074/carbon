/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Application Name">{data.get('environment_name')}</DescriptionItem>
      <DescriptionItem title="Environment Name">{data.get('application_name')}</DescriptionItem>
      <DescriptionItem title="Environment ID">{data.get('environment_id')}</DescriptionItem>
      <DescriptionItem title="Date Created">{formatDateTime(data.get('date_created'))}</DescriptionItem>
      <DescriptionItem title="Environment ARN">{data.get('environment_arn')}</DescriptionItem>
      <DescriptionItem title="Description">{data.get('description')}</DescriptionItem>
      <DescriptionItem title="Status">{data.get('health_status')}</DescriptionItem>
      <DescriptionItem title="Version Label">{data.get('version_label')}</DescriptionItem>
      <DescriptionItem title="Solution Stack">{data.get('solution_stack')}</DescriptionItem>
      <DescriptionItem title="Environment URL">{data.get('environment_url')}</DescriptionItem>
    </DescriptionList>
  );
}
