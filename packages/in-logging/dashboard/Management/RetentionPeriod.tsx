/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import RetentionPeriodContent from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/RetentionPeriod';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import Breadcrumbs from 'in-logging/dashboard/Management/Breadcrumbs';
import { isAddonUserCached } from 'in-logging/api/licence';
import RestrictedAccessMessage from 'in-components/rbac';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-logging/dashboard/Management/Management.mless';

export default function RetentionPeriod() {
  const isLoggingAddonUser = useObservable(isAddonUserCached, []);

  if (!(user?.role?.canConfigureLogRetentionPeriod && isLoggingAddonUser)) return <RestrictedAccessMessage />;

  return (
    <>
      <LoggingDashboardWrapper
        title={t('in-settings:tabs.retentionPeriod.retentionPeriod')}
        withButton={false}
        withTabs={false}
        withTimeSelection={false}
      >
        <Breadcrumbs />
        <section className={locals.content}>
          <RetentionPeriodContent />
        </section>
      </LoggingDashboardWrapper>
    </>
  );
}
