/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import VnicDedicatedAdapter from 'in-phmc/Dashboards/tables/VnicDedicatedAdapter';
import SriovAdapter from 'in-phmc/Dashboards/tables/SriovAdapter';

export default function Network({ timeConfig, data: system }) {
  return (
    <Fragment>
      <SriovAdapter snapshotId={system.id} timeConfig={timeConfig} />
      <VnicDedicatedAdapter snapshotId={system.id} timeConfig={timeConfig} />
    </Fragment>
  );
}
