/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function OpenstackViewSwitcher() {
  return (
    <>
      <DashboardHeader
        icon="lib_openstack"
        label={t('in-openstack:openstackRegions')}
        title={t('in-openstack:openstackRegions')}
      />
      <DashboardHeaderShadowModule />
    </>
  );
}
