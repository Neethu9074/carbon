/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getOpenstackHypervisor from 'in-openstack/subscriptions/getOpenstackHypervisor';
import { getOpenstackHypervisorDashboard } from 'in-openstack/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    hypervisor: getOpenstackHypervisor({
      filter: {
        regionId: props.regionId,
        hypervisorId: props.hypervisorId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function HypervisorBreadcrumb({ hypervisor }) {
    return (
      <>
        {hypervisor && (
          <Breadcrumb
            href$={getOpenstackHypervisorDashboard(hypervisor.id, { regionId: hypervisor.regionId })}
            label={t('in-openstack:breadcrumbs.hypervisors')}
          >
            {hypervisor.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
