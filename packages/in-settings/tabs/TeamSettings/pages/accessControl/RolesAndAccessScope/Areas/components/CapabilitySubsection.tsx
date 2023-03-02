/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { SubsectionHeader } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/components/SubsectionHeader/SubsectionHeader';
import { filterPermissionSet } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/filterPermissionSet';
import { CapabilityLi } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilityLi';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { CapabilityType } from 'in-stores/permission';

interface CapabilitySubsectionProps {
  capabilities: CapabilityType[];
  headerText?: string;
}

export const CapabilitySubsection = ({ capabilities, headerText }: CapabilitySubsectionProps) => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);

  if (capabilities.length === 0) return null;

  const capabilitiesUserHas = filterPermissionSet({
    permissionsSet,
    capabilities
  });

  if (capabilitiesUserHas.length === 0) return null;

  return (
    <>
      {headerText && <SubsectionHeader headerText={headerText} />}
      {capabilitiesUserHas.map(capability => {
        return <CapabilityLi key={capability} capability={capability as CapabilityType} />;
      })}
    </>
  );
};
