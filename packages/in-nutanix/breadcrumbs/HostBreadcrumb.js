/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import getNutanixHost from 'in-nutanix/subscriptions/getNutanixHost';
import { useNutanixEntityLink } from 'in-nutanix/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    host: getNutanixHost({
      filter: {
        datacenterId: props.datacenterId,
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function HostBreadcrumb(props) {
    const { datacenterId, hostId, label } = props;

    const getNutanixHostDashboard = useNutanixEntityLink('host', { datacenterId });

    if (!hostId) return null;

    return (
      <Breadcrumb href={getNutanixHostDashboard(hostId)} label={t('in-nutanix:breadcrumbs.hosts')}>
        {label}
      </Breadcrumb>
    );
  }
);
