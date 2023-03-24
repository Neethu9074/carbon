/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Ul } from '@instana/components';

import {
  useKubernetesClustersConfigs,
  useKubernetesNamespacesConfigs
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Platforms/hooks';
import {
  EntityType,
  KubernetesEntityList
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Platforms/KubernetesEntityList';
import { getKubernetesData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getKubernetesData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import { t } from 'in-i18n';

export const KubernetesListItem = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { kubernetesColumnHeadline } = getKubernetesData(permissionsSet);
  const [kubernetesClusters, , , { loading: clustersLoading }] = useKubernetesClustersConfigs();
  const [kubernetesNamespaces, , , { loading: namespacesLoading }] = useKubernetesNamespacesConfigs();

  return (
    <AreaExpandableListItem
      iconType="lib_kubernetes"
      firstColumnHeadline={kubernetesColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.kubernetes')}
      loading={clustersLoading || namespacesLoading}
      subList={
        <Ul>
          <KubernetesEntityList
            availableEntities={kubernetesNamespaces}
            type={EntityType.Namespace}
            headerText={t('in-settings:productAreas.namespaces')}
          />
          <KubernetesEntityList
            availableEntities={kubernetesClusters}
            type={EntityType.Cluster}
            headerText={t('in-settings:productAreas.clusters')}
          />
        </Ul>
      }
    />
  );
};
