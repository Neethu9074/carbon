/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error needs migration
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { globalSettingsIntegrationsLogging } from 'in-settings/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './Integrations.mless';

export default function IntegrationsBreadcrumb() {
  const { goToPath } = useNavigation();

  return (
    <Breadcrumb className={locals.breadcrumb} onClick={() => goToPath(globalSettingsIntegrationsLogging)}>
      <span className={locals.breadcrumbLink}>{t('in-settings:tabs.integrations.logIntegrations')}</span>
      <span> /</span>
    </Breadcrumb>
  );
}
