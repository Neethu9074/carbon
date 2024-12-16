/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import SloFormComponent, {
  FormComponentProps
} from 'in-custom-dashboards/widgets/SloLegacy/components/SloFormComponent';
import { SloTrackerProvider, sliWidgetTrackers } from 'in-service-levels/hooks/SloTrackerProvider';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';

export default function FormComponent(props: FormComponentProps) {
  return (
    <SloTrackerProvider
      trackers={sliWidgetTrackers}
      meta={{ productArea: productAreas.custom_dashboard, pageName: pageNames.custom_dashboard }}
    >
      <SloFormComponent {...props} />
    </SloTrackerProvider>
  );
}
