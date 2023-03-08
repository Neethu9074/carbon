/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Ul } from '@instana/components';

import { KubernetesListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Platforms/KubernetesListItem';
import { getKubernetesData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getKubernetesData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import { t } from 'in-i18n';

export const PlatformsSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { hasOtherPlatformsAccess, translations } = getKubernetesData(permissionsSet);

  if (!hasOtherPlatformsAccess) return <KubernetesListItem />;

  return (
    <AreaExpandableListItem
      iconType="lib_platforms_inverted"
      firstColumnHeadline={translations.join(', ')}
      firstColumnLabel={t('in-settings:productAreas.platform')}
      subList={<Ul>{<KubernetesListItem />}</Ul>}
    />
  );
};
