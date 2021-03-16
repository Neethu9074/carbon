/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getVsphereVm from 'in-vsphere/subscriptions/getVsphereVm';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    virtualMachine: getVsphereVm({
      filter: {
        vmId: props.vmId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function VmBreadcrumb({ virtualMachine }) {
    return (
      <Breadcrumb label={t('in-vsphere:breadcrumbs.vSphereVm')} icon="lib_vsphere_vm">
        {virtualMachine && virtualMachine.label}
      </Breadcrumb>
    );
  }
);
