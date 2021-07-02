/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ConnectionTable from 'in-forge/plugins/ibmCloudIsLoadBalancer/Dashboard/ConnectionTable';
import HttpStatusTable from 'in-forge/plugins/ibmCloudIsLoadBalancer/Dashboard/HttpStatusTable';
import RequestTable from 'in-forge/plugins/ibmCloudIsLoadBalancer/Dashboard/RequestTable';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      applianceIds: getRawPayload(props.snapshot.get('id'), 'appliances')
    };
  },
  function IbmCloudIsLoadBalancerDashboard({ snapshot, timeConfig, applianceIds }) {
    if (!applianceIds || applianceIds.isEmpty()) {
      return null;
    }

    const ids = applianceIds.unshift('_total_');
    return (
      <div>
        <ConnectionTable snapshot={snapshot} timeConfig={timeConfig} applianceIds={ids} />
        <RequestTable snapshot={snapshot} timeConfig={timeConfig} applianceIds={ids} />
        <HttpStatusTable snapshot={snapshot} timeConfig={timeConfig} applianceIds={ids} />
      </div>
    );
  }
);
