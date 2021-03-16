/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getVsphereHostDashboard } from 'in-vsphere/navigation/paths';
import getVsphereHost from 'in-vsphere/subscriptions/getVsphereHost';
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
  function HostBreadcrumb({ host }) {
    return (
      <>
        {host && (
          <Breadcrumb
            href$={getVsphereHostDashboard(host.id, { datacenterId: host.datacenterId })}
            label={t('in-vsphere:breadcrumbs.esXiHost')}
            icon="lib_linux"
          >
            {host.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
