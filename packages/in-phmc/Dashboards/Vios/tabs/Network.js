/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import VirtualEthernetAdapter from 'in-phmc/Dashboards/tables/VirtualEthernetAdapter';
import SriovLogicalPort from 'in-phmc/Dashboards/tables/SriovLogicalPort';
import GenericAdapter from 'in-phmc/Dashboards/tables/GenericAdapter';
import SharedAdapter from 'in-phmc/Dashboards/tables/SharedAdapter';

export default function Network({ data: vios }) {
  return (
    <Fragment>
      <GenericAdapter snapshotId={vios.id} />
      <SharedAdapter snapshotId={vios.id} />
      <VirtualEthernetAdapter snapshotId={vios.id} />
      <SriovLogicalPort snapshotId={vios.id} />
    </Fragment>
  );
}
