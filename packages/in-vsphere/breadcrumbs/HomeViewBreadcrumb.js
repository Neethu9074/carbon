/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { datacenterListFullyQualified } from 'in-vsphere/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getView } from 'in-stores/navigation';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb() {
  return (
    <Breadcrumb href$={getView(datacenterListFullyQualified)}>
      {t('in-vsphere:breadcrumbs.vSphereDatacenters')}
    </Breadcrumb>
  );
}
