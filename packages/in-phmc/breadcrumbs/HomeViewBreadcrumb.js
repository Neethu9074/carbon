/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { phmcListFullyQualified } from 'in-phmc/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getView } from 'in-stores/navigation';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb() {
  return <Breadcrumb href$={getView(phmcListFullyQualified)}>{t('in-phmc:breadcrumbs.phmcs')}</Breadcrumb>;
}
