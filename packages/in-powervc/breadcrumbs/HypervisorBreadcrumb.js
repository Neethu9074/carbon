/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getPowerVCHypervisor from 'in-powervc/subscriptions/getPowerVCHypervisor';
import { usePowervcHypervisorDashboard } from 'in-powervc/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    hypervisor: getPowerVCHypervisor({
      filter: {
        regionId: props.regionId,
        hypervisorId: props.hypervisorId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function HypervisorBreadcrumb({ hypervisor }) {
    const getPowervcHypervisorDashboard = usePowervcHypervisorDashboard(hypervisor?.regionId);
    return (
      <>
        {hypervisor && (
          <Breadcrumb
            href$={getPowervcHypervisorDashboard(hypervisor.id, { regionId: hypervisor.regionId })}
            label={t('in-powervc:breadcrumbs.hypervisors')}
          >
            {hypervisor.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
