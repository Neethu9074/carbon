/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { t } from 'in-i18n';

export default function CloudfoundryViewSwitcher() {
  return (
    <>
      <DashboardHeader
        icon="lib_cloudfoundry_inverted"
        label={t('in-cloudfoundry:cloudFoundryApplications')}
        title={t('in-cloudfoundry:cloudFoundryApplications')}
      />
      <DashboardHeaderShadowModule />
    </>
  );
}
