/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error needs migration
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { xenserverHostListFullyQualified } from 'in-xenserver/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb() {
  const { goToPath } = useNavigation();
  return <Breadcrumb onClick={() => goToPath(xenserverHostListFullyQualified)}>{t('in-xenserver:hosts')}</Breadcrumb>;
}
