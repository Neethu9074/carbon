/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function HBaseInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Sinks">{data.get('sinks')}</DescriptionItem>
      <DescriptionItem title="Sources">{data.get('sources')}</DescriptionItem>
      <DescriptionItem title="Region Servers">{data.get('region_servers')}</DescriptionItem>
      <DescriptionItem title="Dead Region Servers">{data.get('dead_region_servers')}</DescriptionItem>
      <DescriptionItem title="Cluster Id">{data.get('cluster_id')}</DescriptionItem>
      <DescriptionItem title="Active Master">{data.get('active_master')}</DescriptionItem>
      <DescriptionItem title="Server Name">{formatServerName(data.get('server_name'))}</DescriptionItem>
      <DescriptionItem title="Region Server">{formatServerName(data.get('region_server'))}</DescriptionItem>
      <DescriptionItem title="Zookeeper">{data.get('zookeeper')}</DescriptionItem>
    </DescriptionList>
  );
}

function formatServerName(name) {
  if (name) {
    const splitName = name.split(',');
    return splitName[0] + ':' + splitName[1] + ' / ' + formatDateTime(parseInt(splitName[2]));
  }
  return null;
}
