/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import LogIntegrationsContent from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Integrations/Integrations';
import Breadcrumbs from 'in-logging/dashboard/Configuration/Breadcrumbs';
import RestrictedAccessMessage from 'in-components/rbac';
import { user } from 'in-stores/user';

import locals from 'in-logging/dashboard/Configuration/Configuration.mless';

export default function LogIntegrations() {
  if (!user?.role?.canConfigureIntegrations) return <RestrictedAccessMessage />;

  return (
    <main>
      <header>
        <Breadcrumbs />
      </header>
      <section className={locals.content}>
        <LogIntegrationsContent />
      </section>
    </main>
  );
}
