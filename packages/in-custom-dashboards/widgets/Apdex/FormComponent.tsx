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

export default function FormComponent(props: FormComponentProps) {
  return (
    <SloTrackerProvider value={apdexWidgetTrackers}>
      <ApdexWidgetFormComponent {...props} />
    </SloTrackerProvider>
  );
}
