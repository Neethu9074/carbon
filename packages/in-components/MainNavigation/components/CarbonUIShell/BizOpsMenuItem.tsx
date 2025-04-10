/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { businessProcessPath, isBizOpsView } from 'in-bizops/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { hasBizOpsAccess } from 'in-stores/permission';
import { t } from 'in-i18n';

export default function BizOpsMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasBizOpsAccess) return null;

  const redirectPath = createHrefToPath(businessProcessPath);

  return (
    <MenuItem
      id="main-nav-bizops"
      label={t('in-bizops:navigation.businessMonitoring')}
      icon="lib_bizops"
      isActive={matchLocation(isBizOpsView)}
      href={redirectPath}
    />
  );
}
