/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Ul } from '@instana/components';

import { KubernetesNamespacesList } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Platforms/KubernetesNamespacesList';
import { KubernetesClustersList } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Platforms/KubernetesClustersList';
import { useKubernetesNamespacesConfigs } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Platforms/hooks';
import { getKubernetesData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getKubernetesData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import { t } from 'in-i18n';

export const KubernetesListItem = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { kubernetesColumnHeadline } = getKubernetesData(permissionsSet);
  const [kubernetesNamespaces, , , { loading }] = useKubernetesNamespacesConfigs();

  return (
    <AreaExpandableListItem
      iconType="lib_kubernetes"
      firstColumnHeadline={kubernetesColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.kubernetes')}
      loading={loading}
      subList={
        <Ul>
          <KubernetesClustersList />
          <KubernetesNamespacesList kubernetesNamespaces={kubernetesNamespaces} />
        </Ul>
      }
    />
  );
};
