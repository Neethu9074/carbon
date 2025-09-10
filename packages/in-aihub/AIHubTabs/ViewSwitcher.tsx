/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';

// import AIAgentCatalog from 'in-aihub/AIAgentsComponents/AIAgentCatalog';
import { t } from 'in-i18n';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { aihubGatewaysFullyQualified } from 'in-aihub/navigation/paths';

export default function AIhubOverview() {
  const { createHrefToPath, matchLocation } = useNavigation();
  const isGatewaysActive = matchLocation(aihubGatewaysFullyQualified);
  // const isAgentsActive = matchLocation(aihubAIAgentsFullyQualified) || !isGatewaysActive;

  return (
    <>
      <DashboardHeader
        icon="lib_ai_gateway"
        label={t('in-aihub:viewSwitcherLabelAIGateway')}
        title={t('in-aihub:viewSwitcherLabelAIGateway')}
        labelForTitle={t('in-aihub:viewSwitcherLabelAIGateway')}
        liveModeDisabled
        timePickerDisabled
        timePickerDisabledTooltip={t('in-aihub:general.timePickerDisabledTooltip')}
      />
      <DashboardHeaderModule>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href={createHrefToPath(aihubGatewaysFullyQualified)}
            label={t('in-aihub:tabs.egressGateways')}
            isActive={isGatewaysActive}
          />
          {/* <SecondLevelNavigationItem
            href={createHrefToPath(aihubAIAgentsFullyQualified)}
            label={t('in-aihub:tabs.aiAgents')}
            isActive={isAgentsActive}
          /> */}
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
