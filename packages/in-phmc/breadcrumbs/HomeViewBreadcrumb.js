/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { phmcListFullyQualified } from 'in-phmc/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb() {
  const { createHrefToPath } = useNavigation();

  return <Breadcrumb href={createHrefToPath(phmcListFullyQualified)}>{t('in-phmc:breadcrumbs.phmcs')}</Breadcrumb>;
}
