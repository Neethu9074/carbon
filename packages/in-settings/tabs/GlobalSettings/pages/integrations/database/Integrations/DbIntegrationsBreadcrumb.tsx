/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

// @ts-expect-error needs migration
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { globalSettingsIntegrationsDatabase } from 'in-settings/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './DbIntegrations.mless';

export default function DbIntegrationsBreadcrumb() {
  const { goToPath } = useNavigation();

  return (
    <Breadcrumb className={locals.breadcrumb} onClick={() => goToPath(globalSettingsIntegrationsDatabase)}>
      <span className={locals.breadcrumbLink}>{t('in-settings:tabs.team.integrations.database.dbIntegrations')}</span>
      <span> /</span>
    </Breadcrumb>
  );
}
