/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { sapHanaDashboardFullyQualified } from 'in-sap/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getView } from 'in-stores/navigation';
import { t } from 'in-i18n';

export default function SapHanaBreadcrumb() {
  return <Breadcrumb href$={getView(sapHanaDashboardFullyQualified)}>{t('in-sap:breadcrumbs.SapHana')}</Breadcrumb>;
}
