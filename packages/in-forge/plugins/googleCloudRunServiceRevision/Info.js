import React from 'react';
import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Service">{data.get('service')}</DescriptionItem>
      <DescriptionItem title="Revision">{data.get('revision')}</DescriptionItem>
      <DescriptionItem title="Configuration">{data.get('configuration')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('region')}</DescriptionItem>
      <DescriptionItem title="Availability Zone">{data.get('availabilityZone')}</DescriptionItem>
      <DescriptionItem title="Project ID">{data.get('projectId')}</DescriptionItem>
      <DescriptionItem title="Numeric Project ID">{data.get('numericProjectId')}</DescriptionItem>
      <DescriptionItem title="Runtime">{data.get('runtime')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('port')}</DescriptionItem>
    </DescriptionList>
  );
}
