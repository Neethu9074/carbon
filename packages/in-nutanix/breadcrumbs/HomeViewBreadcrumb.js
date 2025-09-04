/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { nutanixClusterListFullyQualified } from 'in-nutanix/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb() {
  const { goToPath } = useNavigation();
  return (
    <Breadcrumb onClick={() => goToPath(nutanixClusterListFullyQualified)}>
      {t('in-nutanix:breadcrumbs.nutanixDatacenters')}
    </Breadcrumb>
  );
}
