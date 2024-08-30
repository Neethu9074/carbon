/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getVsphereHost from 'in-vsphere/subscriptions/getVsphereHost';
import { useVspehereEntityLink } from 'in-vsphere/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    host: getVsphereHost({
      filter: {
        datacenterId: props.datacenterId,
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function HostBreadcrumb(props) {
    const { datacenterId, hostId, label } = props;

    const getVsphereHostDashboard = useVspehereEntityLink('host', { datacenterId });

    if (!hostId) return null;

    return (
      <Breadcrumb href={getVsphereHostDashboard(hostId)} label={t('in-vsphere:breadcrumbs.esXiHost')} icon="lib_linux">
        {label}
      </Breadcrumb>
    );
  }
);
