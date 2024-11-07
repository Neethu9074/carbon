/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import getNutanixDatacenter from 'in-nutanix/subscriptions/getNutanixDatacenter';
import { useNutanixEntityLink } from 'in-nutanix/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    datacenter: getNutanixDatacenter({
      filter: {
        datacenterId: props.datacenterId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function DatacenterBreadcrumb({ datacenter }) {
    const getNutanixDatacenterDashboard = useNutanixEntityLink('datacenter');

    return (
      <>
        {datacenter && (
          <Breadcrumb
            href={getNutanixDatacenterDashboard(datacenter.id)}
            label={t('in-nutanix:breadcrumbs.nutanixDatacenter')}
            icon="lib_nutanix"
          >
            {datacenter.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
