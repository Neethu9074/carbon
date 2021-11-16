/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import VirtualFiberChannelLpar from 'in-phmc/Dashboards/tables/VirtualFiberChannelLpar';
import GenericVirtualLpar from 'in-phmc/Dashboards/tables/GenericVirtualLpar';

export default function Storage({ data: lpar }) {
  return (
    <Fragment>
      <GenericVirtualLpar snapshotId={lpar.id} />
      <VirtualFiberChannelLpar snapshotId={lpar.id} />
    </Fragment>
  );
}
