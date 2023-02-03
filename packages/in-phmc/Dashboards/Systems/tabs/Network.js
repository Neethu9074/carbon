/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import SriovAdapter from 'in-phmc/Dashboards/tables/SriovAdapter';

export default function Network({ timeConfig, data: system }) {
  return (
    <Fragment>
      <SriovAdapter snapshotId={system.id} timeConfig={timeConfig}/>
    </Fragment>
  );
}
