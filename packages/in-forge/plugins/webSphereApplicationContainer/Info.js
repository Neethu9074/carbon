/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { emptyList } from 'in-services/fixedImmutables';

export default function WebSphereInfo({ snapshot }) {
  const data = snapshot.get('data');
  const webModules = snapshot.getIn(['data', 'webModules'], emptyList);
  const datasources = snapshot.getIn(['data', 'datasourceNames'], emptyList);

  return (
    <DescriptionList>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Node Name">{data.get('nodeName')}</DescriptionItem>
      <DescriptionItem title="Server Name">{data.get('serverName')}</DescriptionItem>
      <DescriptionItem title="Cell Name">{data.get('cellName')}</DescriptionItem>
      <DescriptionItem title="State">{data.get('state')}</DescriptionItem>
      <DescriptionItem title="Web Modules">{webModules.size}</DescriptionItem>
      <DescriptionItem title="Datasources">{datasources.size}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
