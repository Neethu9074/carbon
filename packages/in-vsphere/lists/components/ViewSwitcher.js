/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-new-components/DashboardHeader';

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
