/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { clusterListFullyQualified } from 'in-kubernetes/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb() {
  const { createHrefToPath } = useNavigation();
  return (
    <Breadcrumb href={createHrefToPath(clusterListFullyQualified)}>
      {t('in-kubernetes:breadcrumbs.kubernetes')}
    </Breadcrumb>
  );
}
