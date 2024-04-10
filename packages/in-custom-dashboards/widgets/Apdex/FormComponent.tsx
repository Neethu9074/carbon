/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ApdexWidgetFormComponent, {
  FormComponentProps
} from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidgetFormComponent';
import { SloTrackerProvider, apdexWidgetTrackers } from 'in-service-levels/hooks/SloTrackerProvider';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';

export default function FormComponent(props: FormComponentProps) {
  return (
    <SloTrackerProvider
      trackers={apdexWidgetTrackers}
      meta={{ productArea: productAreas.custom_dashboard, pageName: pageNames.custom_dashboard }}
    >
      <ApdexWidgetFormComponent {...props} />
    </SloTrackerProvider>
  );
}
