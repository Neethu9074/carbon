/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import AIHubTabs from 'in-aihub/AIHubTabs/AIHubTabs';
import { t } from 'in-i18n';

import locals from 'in-aihub/AIAgentsComponents/AIAgentCatalog.mless';

export default function AIAgentCatalog() {
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.ai_gateway,
          pageRootName: pageNames.aiGateway_llmGateways
        }}
      />
      <AIHubTabs>
        <div className={locals['ai-agents-placeholder']}>
          <h2>{t('in-aihub:aiAgents.comingSoon')}</h2>
          <p>{t('in-aihub:aiAgents.description')}</p>
        </div>
      </AIHubTabs>
    </>
  );
}
