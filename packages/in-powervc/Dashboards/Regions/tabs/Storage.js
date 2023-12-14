/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import StorageDetails from 'in-powervc/Dashboards/tables/StorageDetails';

export default function Storage({ timeConfig, data: region }) {
  return (
    <Fragment>
      <StorageDetails snapshotId={region.id} timeConfig={timeConfig} />
    </Fragment>
  );
}
