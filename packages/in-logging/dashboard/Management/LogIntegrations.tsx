/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import LogIntegrationsContent from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Integrations/Integrations';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import Breadcrumbs from 'in-logging/dashboard/Management/Breadcrumbs';
import RestrictedAccessMessage from 'in-components/rbac';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-logging/dashboard/Management/Management.mless';

export default function LogIntegrations() {
  if (!user?.role?.canConfigureLogManagement) return <RestrictedAccessMessage />;

  return (
    <div>
      <LoggingDashboardWrapper
        title={t('in-settings:tabs.integrations.logIntegrations')}
        withButton={false}
        withTabs={false}
        withTimeSelection={false}
      >
        <Breadcrumbs />
        <section className={locals.content}>
          <LogIntegrationsContent />
        </section>
      </LoggingDashboardWrapper>
    </div>
  );
}
