/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function MySqlInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('port')}</DescriptionItem>
      <DescriptionItem title="Version">{getVersion(data)}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Role">{data.get('role')}</DescriptionItem>
      <DescriptionItem title="Replication Group Name">{data.get('replicationGroup')}</DescriptionItem>
      <DescriptionItem title="Max connections">{data.get('variables.MAX_CONNECTIONS')}</DescriptionItem>
    </DescriptionList>
  );
}

function getVersion(data) {
  const version = data.get('variables.VERSION');
  const comment = data.get('variables.VERSION_COMMENT');

  if (version && comment) {
    return (
      <span>
        {version}
        <br />
        {comment}
      </span>
    );
  } else if (!version && comment) {
    return comment;
  } else if (version && !comment) {
    return version;
  }

  return null;
}
