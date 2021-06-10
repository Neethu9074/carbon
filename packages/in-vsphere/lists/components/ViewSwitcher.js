/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function VSphereViewSwitcher() {
  return (
    <>
      <DashboardHeader
        icon="lib_vsphere_inverted"
        label={t('in-vsphere:vSphereDatacenters')}
        title={t('in-vsphere:vSphereDatacenters')}
      />
      <DashboardHeaderShadowModule />
    </>
  );
}
