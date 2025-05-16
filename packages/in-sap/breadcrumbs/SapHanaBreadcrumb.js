/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { sapHanaDashboardFullyQualified } from 'in-sap/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { t } from 'in-i18n';

export default function SapHanaBreadcrumb() {
  const { createHrefToPath } = useNavigation();

  return (
    <Breadcrumb href={createHrefToPath(sapHanaDashboardFullyQualified)}>{t('in-sap:breadcrumbs.SapHana')}</Breadcrumb>
  );
}
