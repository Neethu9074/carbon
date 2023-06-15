/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import AutomationTabs from 'in-automation/AutomationTabs/AutomationTabs';

export default function ActionHistory() {
  return (
    <AutomationTabs>
      <ActionHistoryTable />
    </AutomationTabs>
  );
}
