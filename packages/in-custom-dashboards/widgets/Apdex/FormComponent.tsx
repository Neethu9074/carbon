/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import {
  ApdexWidgetTrackerProvider,
  defaultTrackers
} from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidgetTrackerProvider';
import ApdexWidgetFormComponent, {
  FormComponentProps
} from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidgetFormComponent';

export default function FormComponent(props: FormComponentProps) {
  return (
    <ApdexWidgetTrackerProvider value={defaultTrackers}>
      <ApdexWidgetFormComponent {...props} />
    </ApdexWidgetTrackerProvider>
  );
}
