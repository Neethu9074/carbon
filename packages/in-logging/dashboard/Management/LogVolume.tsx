/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { LogVolume as LogVolumeContent } from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/LogVolume';
import Breadcrumbs from 'in-logging/dashboard/Management/Breadcrumbs';
import { isAddonUserCached } from 'in-logging/api/licence';
import RestrictedAccessMessage from 'in-components/rbac';
import { user } from 'in-stores/user';

import locals from './Management.mless';

export default function LogVolume() {
  const isLoggingAddonUser = useObservable(isAddonUserCached, []);

  if (!(user?.role?.canViewLogVolume && isLoggingAddonUser)) return <RestrictedAccessMessage />;

  return (
    <main>
      <header>
        <Breadcrumbs />
      </header>
      <section className={locals.content}>
        <LogVolumeContent />
      </section>
    </main>
  );
}
