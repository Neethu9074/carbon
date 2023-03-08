/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Ul } from '@instana/components';

import {
  accountAndBillingCapabilities,
  agentsCapabilities,
  syntheticMonitoringCapabilities,
  automationCapabilities,
  customDashboardCapabilities,
  mixedCapabilities,
  accessControlCapabilities
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { getCapabilitiesSectionData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getCapabilitiesSectionData';
import { CapabilitySubsection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
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
        capabilities={customDashboardCapabilities}
        headerText={t('in-settings:productAreas.permissions', { context: ProductArea.DASHBOARD })}
      />
      <CapabilitySubsection
        capabilities={syntheticMonitoringCapabilities}
        headerText={t('in-settings:productAreas.permissions', { context: ProductArea.SYNTHETICS })}
      />
      <CapabilitySubsection
        capabilities={agentsCapabilities}
        headerText={t('in-settings:productAreas.permissions', { context: ProductArea.AGENTS })}
      />
      <CapabilitySubsection
        capabilities={accessControlCapabilities}
        headerText={t('in-settings:productAreas.permissions', { context: ProductArea.ACCESS_CONTROL })}
      />
      <CapabilitySubsection
        capabilities={accountAndBillingCapabilities}
        headerText={t('in-settings:productAreas.permissions', { context: ProductArea.ACCOUNT })}
      />
      <CapabilitySubsection
        capabilities={automationCapabilities}
        headerText={t('in-settings:productAreas.permissions', { context: ProductArea.AUTOMATION })}
      />
    </Ul>
  );

  return (
    <AreaExpandableListItem
      iconType="lib_actions_settings_inverted"
      firstColumnHeadline={columnHeadline}
      firstColumnLabel={t('in-settings:productAreas.function')}
      subList={subListContent}
    />
  );
};
