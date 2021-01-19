/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import InstanceStatusLabel from 'in-forge/plugins/googleCloudSQL/InstanceStatusLabel';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Status">
        <InstanceStatusLabel status={data.get('database.state')} />
      </DescriptionItem>
      <DescriptionItem title="Database version">{data.get('databaseVersion')}</DescriptionItem>
      <DescriptionItem title="Disk size">{data.get('currentDiskSize')} GB</DescriptionItem>
      <DescriptionItem title="Region">{data.get('region')}</DescriptionItem>
      <DescriptionItem title="Zone">{data.get('gceZone')}</DescriptionItem>
      <DescriptionItem title="Tier">{data.get('tier')}</DescriptionItem>
      <DescriptionItem title="Instance type">{data.get('instanceType')}</DescriptionItem>
      <DescriptionItem title="Master">{data.get('masterInstanceName')}</DescriptionItem>
      <DescriptionItem title="Slave IO running">
        {data.get('database.mysql.replication.slave_io_running')}
      </DescriptionItem>
      <DescriptionItem title="Slave SQL running">
        {data.get('database.mysql.replication.slave_sql_running')}
      </DescriptionItem>
    </DescriptionList>
  );
}
