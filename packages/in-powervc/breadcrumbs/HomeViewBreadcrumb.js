/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { powervcRegionListFullyQualified } from 'in-powervc/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getView } from 'in-stores/navigation';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb() {
  return <Breadcrumb href$={getView(powervcRegionListFullyQualified)}>{t('in-powervc:breadcrumbs.regions')}</Breadcrumb>;
}
