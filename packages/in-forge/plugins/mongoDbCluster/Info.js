import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('clusterName')}</DescriptionItem>
      <DescriptionItem title="Type">{data.get('clusterType')}</DescriptionItem>
      <DescriptionItem title="Creation Date">{data.get('clusterCreationDate')}</DescriptionItem>
      <DescriptionItem title="Cloud Provider">{data.get('clusterProvider')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('clusterRegion')}</DescriptionItem>
      <DescriptionItem title="Instance Size Name">{data.get('clusterInstanceSizeName')}</DescriptionItem>
      <DescriptionItem title="Project">{data.get('clusterProjectName')}</DescriptionItem>
      <DescriptionItem title="Organisation">{data.get('clusterOrganisationName')}</DescriptionItem>
    </DescriptionList>
  );
}
