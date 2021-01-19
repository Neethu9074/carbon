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
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Id">{data.get('id')}</DescriptionItem>
      <DescriptionItem title="Project Number">{data.get('projectNumber')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('gceZone')}</DescriptionItem>
      <DescriptionItem title="Location Type">{data.get('locationType')}</DescriptionItem>
      <DescriptionItem title="Storage Class">{data.get('storageClass')}</DescriptionItem>
      <DescriptionItem title="Created At">{formatDateTime(data.get('created', ''))}</DescriptionItem>
      <DescriptionItem title="Updated At">{formatDateTime(data.get('updated', ''))}</DescriptionItem>
    </DescriptionList>
  );
}
