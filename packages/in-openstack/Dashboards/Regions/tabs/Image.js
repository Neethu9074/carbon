/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import ImageTable from 'in-openstack/Dashboards/Table/ImageTable';

export default function Image({ timeConfig, data: region }) {
  return (
    <Fragment>
      <ImageTable snapshotId={region.id} timeConfig={timeConfig} />
    </Fragment>
  );
}
