/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import GenericPhysicalAdapter from 'in-phmc/Dashboards/tables/GenericPhysicalAdapter';
import GenericVirtualAdapter from 'in-phmc/Dashboards/tables/GenericVirtualAdapter';
import SharedStoragePool from 'in-phmc/Dashboards/tables/SharedStoragePool';
import FiberChannel from 'in-phmc/Dashboards/tables/FiberChannel';

export default function Storage({ timeConfig, data: vios }) {
  return (
    <Fragment>
      <GenericPhysicalAdapter snapshotId={vios.id} timeConfig={timeConfig} />
      <GenericVirtualAdapter snapshotId={vios.id} timeConfig={timeConfig} />
      <FiberChannel snapshotId={vios.id} timeConfig={timeConfig} />
      <SharedStoragePool snapshotId={vios.id} timeConfig={timeConfig} />
    </Fragment>
  );
}
