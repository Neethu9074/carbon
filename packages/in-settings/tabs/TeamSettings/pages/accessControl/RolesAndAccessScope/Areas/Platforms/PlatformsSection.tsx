/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Ul } from '@instana/components';

import {
  AccessKind,
  getKubernetesData
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getKubernetesData';
import { KubernetesListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Platforms/KubernetesListItem';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import GeneralPlatformListItem from './GeneralPlatformListItem';
import { ProductArea } from '../../constants';
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

  if (!groupConfig.hasOtherPlatformsAccess && groupConfig.kubernetesAccess !== AccessKind.None)
    return currentKubeInstance();

  const sublist = groupConfig.hasOtherPlatformsAccess ? (
    <Ul>
      {groupConfig.pcfAccess !== AccessKind.None && <GeneralPlatformListItem area={ProductArea.PCF} />}
      {groupConfig.phmcAccess !== AccessKind.None && <GeneralPlatformListItem area={ProductArea.PHMC} />}
      {groupConfig.zhmcAccess !== AccessKind.None && <GeneralPlatformListItem area={ProductArea.ZHMC} />}
      {groupConfig.openStackAccess !== AccessKind.None && <GeneralPlatformListItem area={ProductArea.OPENSTACK} />}
      {groupConfig.vSphereAccess !== AccessKind.None && <GeneralPlatformListItem area={ProductArea.VSPHERE} />}
      {groupConfig.sapAccess !== AccessKind.None && <GeneralPlatformListItem area={ProductArea.SAP} />}
      {groupConfig.kubernetesAccess !== AccessKind.None && currentKubeInstance()}
    </Ul>
  ) : (
    <></>
  );

  return (
    <AreaExpandableListItem
      iconType="lib_platforms_inverted"
      firstColumnHeadline={groupConfig.translations.join(', ')}
      firstColumnLabel={t('in-settings:productAreas.title_platforms')}
      subList={sublist}
    />
  );
};
