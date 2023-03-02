/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { KubernetesNamespace, PaginatedResult } from '@instana/types';
import { Li, Typography } from '@instana/components';

import { SubsectionHeader } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/components/SubsectionHeader/SubsectionHeader';
import { getKubernetesData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getKubernetesData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';

interface KubernetesNamespacesListProps {
  kubernetesNamespaces: PaginatedResult<KubernetesNamespace> | undefined;
}

export const KubernetesNamespacesList = ({ kubernetesNamespaces }: KubernetesNamespacesListProps) => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { kubernetesNamespacesWithAccess } = getKubernetesData(permissionsSet);

  const { kubernetesNamespaceUIDs } = permissionsSet;
  const kubernetesNamespacesToDisplay = kubernetesNamespaces?.items.filter(kubernetesNamespace =>
    kubernetesNamespacesWithAccess.includes(kubernetesNamespace.id)
  );

  if (!kubernetesNamespaceUIDs.length || !kubernetesNamespacesToDisplay?.length) return null;

  return (
    <>
      <SubsectionHeader headerText="Namespaces" />
      {kubernetesNamespacesToDisplay.map(kubernetesNamespace => (
        <Li noAlternatingBg key={kubernetesNamespace.id}>
          <Typography variant="body-regular">{kubernetesNamespace.label}</Typography>
        </Li>
      ))}
    </>
  );
};
