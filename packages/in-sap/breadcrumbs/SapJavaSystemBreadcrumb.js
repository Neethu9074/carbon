/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { sapJavaSystemDashboardFullyQualified } from 'in-sap/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getView } from 'in-stores/navigation';
import { t } from 'in-i18n';

export default function SapJavaSystemBreadcrumb() {
  return (
    <Breadcrumb href$={getView(sapJavaSystemDashboardFullyQualified)}>
      {t('in-sap:breadcrumbs.SapJavaSystem')}
    </Breadcrumb>
  );
}
