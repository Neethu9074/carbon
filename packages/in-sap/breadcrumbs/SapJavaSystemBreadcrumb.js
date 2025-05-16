/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { sapJavaSystemDashboardFullyQualified } from 'in-sap/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { t } from 'in-i18n';

export default function SapJavaSystemBreadcrumb() {
  const { createHrefToPath } = useNavigation();

  return (
    <Breadcrumb href={createHrefToPath(sapJavaSystemDashboardFullyQualified)}>
      {t('in-sap:breadcrumbs.SapJavaSystem')}
    </Breadcrumb>
  );
}
