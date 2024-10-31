/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Li, Typography } from '@instana/components';

import {
  filterPermissionSet,
  filterPermissionSetByArea
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/filterPermissionSet';
import { SubsectionHeader } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/SubsectionHeader/SubsectionHeader';
import { CapabilityLi } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilityLi';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaPermissionType, CapabilityType, productAreaPermissions } from 'in-stores/permission';

interface CapabilitySubsectionProps {
  capabilities: CapabilityType[];
  headerText?: string;
  areaPermissions?: AreaPermissionType[];
}

export const CapabilitySubsection = ({ capabilities, headerText, areaPermissions }: CapabilitySubsectionProps) => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);

  if (capabilities.length === 0 && (!areaPermissions || areaPermissions.length === 0)) return null;

  const capabilitiesUserHas = filterPermissionSet({
    permissionsSet,
    capabilities
  });

  const areaPermissionsUserHas =
    areaPermissions &&
    filterPermissionSetByArea({
      permissionsSet,
      areaPermissions
    });

  if (capabilitiesUserHas.length === 0 && (!areaPermissionsUserHas || areaPermissionsUserHas.length === 0)) {
    return null;
  }
  return (
    <>
      {headerText && <SubsectionHeader headerText={headerText} />}
      {capabilitiesUserHas.map(capability => {
        return <CapabilityLi key={capability} capability={capability as CapabilityType} />;
      })}
      {areaPermissionsUserHas &&
        areaPermissionsUserHas.map(areaPermission => {
          const areaPermissionLabel = productAreaPermissions.filter(
            productAreaPermission => productAreaPermission.value === areaPermission
          )?.[0]?.label;
          return (
            <Li key={areaPermission} noAlternatingBg>
              <Typography variant="body-regular">{areaPermissionLabel}</Typography>
            </Li>
          );
        })}
    </>
  );
};
