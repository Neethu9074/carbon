/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import AutomationTabs from 'in-automation/AutomationTabs/AutomationTabs';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';

export default function ActionHistory() {
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.automation,
          pageRootName: pageNames.automation_action_history
        }}
      />
      <AutomationTabs>
        <ActionHistoryTable />
      </AutomationTabs>
    </>
  );
}
