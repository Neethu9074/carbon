/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error needs migration
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { windowsHypervisorHostListFullyQualified } from 'in-windowshypervisor/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb() {
  const { goToPath } = useNavigation();
  return (
    <Breadcrumb onClick={() => goToPath(windowsHypervisorHostListFullyQualified)}>
      {t('in-windowshypervisor:hosts')}
    </Breadcrumb>
  );
}
