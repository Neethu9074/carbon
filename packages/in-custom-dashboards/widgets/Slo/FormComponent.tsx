/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import {
  defaultTrackers,
  SloWidgetTrackerProvider
} from 'in-custom-dashboards/widgets/Slo/components/SloWidgetTrackerProvider';
import SloFormComponent, { FormComponentProps } from 'in-custom-dashboards/widgets/Slo/components/SloFormComponent';

export default function FormComponent(props: FormComponentProps) {
  return (
    <SloWidgetTrackerProvider value={defaultTrackers}>
      <SloFormComponent {...props} />
    </SloWidgetTrackerProvider>
  );
}
