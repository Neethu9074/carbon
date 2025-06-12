/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { datacenterListFullyQualified } from 'in-vsphere/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb() {
  const { createHrefToPath } = useNavigation();

  return (
    <Breadcrumb href={createHrefToPath(datacenterListFullyQualified)}>
      {t('in-vsphere:breadcrumbs.vSphereDatacenters')}
    </Breadcrumb>
  );
}
