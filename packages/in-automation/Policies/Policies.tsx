/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import AutomationTabs from 'in-automation/AutomationTabs/AutomationTabs';
import { productAreas } from 'in-services/tracking/productAreas';
import PolicyTable from 'in-automation/PolicyTable/PolicyTable';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';

export default function Policies() {
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.automation,
          pageRootName: pageNames.automation_policies
        }}
      />
      <AutomationTabs>
        <PolicyTable />
      </AutomationTabs>
    </>
  );
}
