/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import { useVspehereEntityLink } from 'in-vsphere/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    datacenter: getVsphereDatacenter({
      filter: {
        datacenterId: props.datacenterId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function DatacenterBreadcrumb({ datacenter }) {
    const getVsphereDatacenterDashboard = useVspehereEntityLink('datacenter');

    return (
      <>
        {datacenter && (
          <Breadcrumb
            href={getVsphereDatacenterDashboard(datacenter.id)}
            label={t('in-vsphere:breadcrumbs.vSphereDatacenter')}
            icon="lib_vsphere_datacenter"
          >
            {datacenter.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
