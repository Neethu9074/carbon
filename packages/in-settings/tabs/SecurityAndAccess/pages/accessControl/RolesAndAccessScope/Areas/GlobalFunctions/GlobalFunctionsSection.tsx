/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Ul } from '@instana/components';

import {
  customDashboardCapabilities,
  mixedCapabilities,
  logCapabilities,
  accessControlCapabilities,
  ProductArea,
  eventAndAlertCapabilities,
  agentsCapabilities
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { getCapabilitiesSectionData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getCapabilitiesSectionData';
import { CapabilitySubsection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { newOTelPageEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export const GlobalFunctionsSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { columnHeadline, shouldRenderContent } = getCapabilitiesSectionData({
    area: ProductArea.GLOBAL,
    permissionsSet
  });

  if (!shouldRenderContent) return null;

  const subListContent = (
    <Ul>
      <CapabilitySubsection capabilities={mixedCapabilities} headerText={t('in-settings:productAreas.permissions')} />
      <CapabilitySubsection
        capabilities={eventAndAlertCapabilities}
        headerText={t('in-settings:productAreas.permissions', { context: ProductArea.EVENT })}
      />
      <CapabilitySubsection
        capabilities={logCapabilities}
        headerText={t('in-settings:productAreas.permissions', { context: ProductArea.LOGS })}
      />
      <CapabilitySubsection
        capabilities={customDashboardCapabilities}
        headerText={t('in-settings:productAreas.permissions', { context: ProductArea.DASHBOARD })}
      />
      <CapabilitySubsection
        capabilities={agentsCapabilities}
        headerText={t('in-settings:productAreas.permissions', {
          context: newOTelPageEnabled ? ProductArea.DATASOURCE : ProductArea.AGENTS
        })}
      />
      <CapabilitySubsection
        capabilities={accessControlCapabilities}
        headerText={t('in-settings:productAreas.permissions', { context: ProductArea.ACCESS_CONTROL })}
      />
    </Ul>
  );

  return (
    <AreaExpandableListItem
      iconType="lib_actions_settings_inverted"
      firstColumnHeadline={columnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_global_functions')}
      subList={subListContent}
    />
  );
};
