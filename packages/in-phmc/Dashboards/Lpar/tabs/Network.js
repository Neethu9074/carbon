/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import VirtualEthernetLpar from 'in-phmc/Dashboards/tables/VirtualEthernetLpar';
import SriovLpar from 'in-phmc/Dashboards/tables/SriovLpar';

export default function Network({ timeConfig, data: lpar }) {
  return (
    <Fragment>
      <VirtualEthernetLpar snapshotId={lpar.id} timeConfig={timeConfig}/>
      <SriovLpar snapshotId={lpar.id} timeConfig={timeConfig}/>
    </Fragment>
  );
}
