/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { powervcRegionListFullyQualified } from 'in-powervc/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb() {
  const { createHrefToPath } = useNavigation();
  return (
    <Breadcrumb href={createHrefToPath(powervcRegionListFullyQualified)}>
      {t('in-powervc:breadcrumbs.regions')}
    </Breadcrumb>
  );
}
