/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Ul } from '@instana/components';

import {
  useKubernetesClustersConfigs,
  useKubernetesNamespacesConfigs
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Platforms/hooks';
import { KubernetesEntityList } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Platforms/KubernetesEntityList';
import {
  ScopedPermissionItem,
  ScopedPermissionType
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { t } from 'in-i18n';

interface Props {
  selectedAccess: ScopedPermissionType;
  headline: string;
  clustersWithAccess: string[];
  namespacesWithAccess: string[];
}

export const KubernetesListItem = ({ clustersWithAccess, headline, selectedAccess, namespacesWithAccess }: Props) => {
  const [kubernetesClusters, , , { loading: clustersLoading }] = useKubernetesClustersConfigs();
  const [kubernetesNamespaces, , , { loading: namespacesLoading }] = useKubernetesNamespacesConfigs();

  const kubeEntities = () => (
    <>
      <KubernetesEntityList
        availableEntities={kubernetesNamespaces}
        headerText={t('in-settings:productAreas.namespaces')}
        accessableEntities={namespacesWithAccess}
      />
      <KubernetesEntityList
        availableEntities={kubernetesClusters}
        headerText={t('in-settings:productAreas.clusters')}
        accessableEntities={clustersWithAccess}
      />
    </>
  );

  return (
    <AreaExpandableListItem
      iconType="lib_kubernetes"
      firstColumnHeadline={headline}
      firstColumnLabel={t('in-settings:productAreas.kubernetes')}
      loading={clustersLoading || namespacesLoading}
      disabled={selectedAccess === ScopedPermissionItem.NO_ACCESS}
      subList={<Ul>{selectedAccess === ScopedPermissionItem.LIMITED_ACCESS && kubeEntities()}</Ul>}
    />
  );
};
