/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import FlavorTable from '../../Table/FlavorTable';

export default function Flavor({ timeConfig, data: region }) {
  return (
    <Fragment>
      <FlavorTable snapshotId={region.id} timeConfig={timeConfig} />
    </Fragment>
  );
}
