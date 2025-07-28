/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { LogVolume as LogVolumeContent } from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/LogVolume';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import Breadcrumbs from 'in-logging/dashboard/Management/Breadcrumbs';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { isAddonUserCached } from 'in-logging/api/licence';
import RestrictedAccessMessage from 'in-components/rbac';
import { t } from 'in-i18n';

import locals from './Management.mless';

export default function LogVolume() {
  const [role] = useCurrentUserRole();
  const isLoggingAddonUser = useObservable(isAddonUserCached, []);

  if (!(role.canViewLogVolume && isLoggingAddonUser)) return <RestrictedAccessMessage />;

  return (
    <main>
      <LoggingDashboardWrapper
        title={t('in-settings:tabs.logVolume.logVolume')}
        withButton={false}
        withTabs={false}
        withTimeSelection={false}
      >
        <Breadcrumbs />
        <section className={locals.content}>
          <LogVolumeContent />
        </section>
      </LoggingDashboardWrapper>
    </main>
  );
}
