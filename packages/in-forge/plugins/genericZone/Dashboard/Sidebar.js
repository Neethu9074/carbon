/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ZoneHostsList from 'in-sdk/components/sidebar/ZoneItemsList';

export default function GenericZoneSidebar({ snapshot }) {
  return <ZoneHostsList snapshotId={snapshot.get('id')} />;
}
