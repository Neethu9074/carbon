/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Li, Typography } from '@instana/components';

import { SubsectionHeader } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/components/SubsectionHeader/SubsectionHeader';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { t } from 'in-i18n';

export const KubernetesClustersList = () => {
  const {
    permissionsSet: { kubernetesClusterUUIDs }
  } = useContext(RolesAndAccessScopeContext);

  if (kubernetesClusterUUIDs.length === 0) return null;

  return (
    <>
      <SubsectionHeader headerText={t('in-settings:productAreas.clusters')} />
      {kubernetesClusterUUIDs.map(kubernetesСluster => (
        <Li noAlternatingBg key={kubernetesСluster.scopeId}>
          <Typography variant="body-regular">{kubernetesСluster.scopeId}</Typography>
        </Li>
      ))}
    </>
  );
};
