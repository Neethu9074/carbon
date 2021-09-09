/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import AdapterInfoTable from '../../tables/AdapterInfoTable';
import PacketsTable from '../../tables/PacketsTable';
import NoData from '../../commonComponents/NoData';
import BytesTable from '../../tables/BytesTable';

export default function NetworkPorts({ data }) {
  if (data.dpmEnabled === 'false') {
    return <NoData />;
  } else {
    return (
      <Fragment>
        <BytesTable data={data} />
        <PacketsTable data={data} />
        <AdapterInfoTable data={data} />
      </Fragment>
    );
  }
}
