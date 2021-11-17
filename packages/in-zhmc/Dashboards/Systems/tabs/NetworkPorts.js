/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import PartitionNetworks from 'in-zhmc/Dashboards/tables/PartitionNetworks';
import AdapterInfoTable from 'in-zhmc/Dashboards/tables/AdapterInfoTable';
import PacketsTable from 'in-zhmc/Dashboards/tables/PacketsTable';
import NoData from 'in-zhmc/Dashboards/commonComponents/NoData';
import BytesTable from 'in-zhmc/Dashboards/tables/BytesTable';

export default function NetworkPorts({ data }) {
  if (data.dpmEnabled === 'false') {
    return <NoData />;
  } else {
    return (
      <Fragment>
        <BytesTable data={data} />
        <PacketsTable data={data} />
        <AdapterInfoTable data={data} />
        <PartitionNetworks data={data} />
      </Fragment>
    );
  }
}
