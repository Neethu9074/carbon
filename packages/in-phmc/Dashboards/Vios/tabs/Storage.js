/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import GenericPhysicalAdapter from 'in-phmc/Dashboards/tables/GenericPhysicalAdapter';
import GenericVirtualAdapter from 'in-phmc/Dashboards/tables/GenericVirtualAdapter';
import SharedStoragePool from 'in-phmc/Dashboards/tables/SharedStoragePool';
import FiberChannel from 'in-phmc/Dashboards/tables/FiberChannel';

export default function Storage({ data: vios }) {
  return (
    <Fragment>
      <GenericPhysicalAdapter snapshotId={vios.id} />
      <GenericVirtualAdapter snapshotId={vios.id} />
      <FiberChannel snapshotId={vios.id} />
      <SharedStoragePool snapshotId={vios.id} />
    </Fragment>
  );
}
