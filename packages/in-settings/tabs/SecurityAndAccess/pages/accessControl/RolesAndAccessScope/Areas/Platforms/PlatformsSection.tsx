/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Ul } from '@instana/components';

import GeneralPlatformListItem from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Platforms/GeneralPlatformListItem';
import { KubernetesListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Platforms/KubernetesListItem';
import {
  ProductArea,
  ScopedPermissionItem
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { getKubernetesData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getPlatformData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { t } from 'in-i18n';

export const PlatformsSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const groupConfig = getKubernetesData(permissionsSet);

  const currentKubeInstance = () => (
    <KubernetesListItem
      selectedAccess={groupConfig.kubernetesAccess}
      clustersWithAccess={groupConfig.kubernetesClustersWithAccess}
      namespacesWithAccess={groupConfig.kubernetesNamespacesWithAccess}
      headline={groupConfig.kubernetesColumnHeadline}
    />
  );

  if (!groupConfig.hasOtherPlatformsAccess) return currentKubeInstance();

  const sublist = groupConfig.hasOtherPlatformsAccess ? (
    <Ul>
      {groupConfig.pcfAccess !== ScopedPermissionItem.NO_ACCESS && <GeneralPlatformListItem area={ProductArea.PCF} />}
      {groupConfig.phmcAccess !== ScopedPermissionItem.NO_ACCESS && <GeneralPlatformListItem area={ProductArea.PHMC} />}
      {groupConfig.powervcAccess !== ScopedPermissionItem.NO_ACCESS && (
        <GeneralPlatformListItem area={ProductArea.POWERVC} />
      )}

      {groupConfig.zhmcAccess !== ScopedPermissionItem.NO_ACCESS && <GeneralPlatformListItem area={ProductArea.ZHMC} />}
      {groupConfig.openStackAccess !== ScopedPermissionItem.NO_ACCESS && (
        <GeneralPlatformListItem area={ProductArea.OPENSTACK} />
      )}
      {groupConfig.vSphereAccess !== ScopedPermissionItem.NO_ACCESS && (
        <GeneralPlatformListItem area={ProductArea.VSPHERE} />
      )}
      {groupConfig.sapAccess !== ScopedPermissionItem.NO_ACCESS && <GeneralPlatformListItem area={ProductArea.SAP} />}
      {groupConfig.nutanixAccess !== ScopedPermissionItem.NO_ACCESS && (
        <GeneralPlatformListItem area={ProductArea.NUTANIX} />
      )}
      {groupConfig.kubernetesAccess !== ScopedPermissionItem.NO_ACCESS && currentKubeInstance()}
    </Ul>
  ) : (
    <></>
  );

  return (
    <AreaExpandableListItem
      iconType="lib_platforms_inverted"
      firstColumnHeadline={groupConfig.translations.join(', ')}
      firstColumnLabel={t('in-settings:productAreas.title_platforms')}
      disabled={groupConfig.isDisabled}
      subList={sublist}
    />
  );
};
