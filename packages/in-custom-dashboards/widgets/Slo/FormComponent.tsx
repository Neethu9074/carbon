/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { SloTrackerProvider, sloWidgetTrackers } from 'in-service-levels/hooks/SloTrackerProvider';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';

export default function FormComponent() {
  return (
    <SloTrackerProvider
      trackers={sloWidgetTrackers}
      meta={{ productArea: productAreas.custom_dashboard, pageName: pageNames.custom_dashboard }}
    >
      {/* TODO: The component that handles the form must be implemented here. */}
      <div style={{ backgroundColor: 'magenta', width: '100%', height: '100%', minHeight: 100, minWidth: 100 }} />
    </SloTrackerProvider>
  );
}
