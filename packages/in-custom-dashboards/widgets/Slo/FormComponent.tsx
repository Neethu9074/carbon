/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import SloFormComponent, { FormComponentProps } from 'in-custom-dashboards/widgets/Slo/components/SloFormComponent';
import { SloTrackerProvider, sliWidgetTrackers } from 'in-service-levels/hooks/SloTrackerProvider';

export default function FormComponent(props: FormComponentProps) {
  return (
    <SloTrackerProvider value={sliWidgetTrackers}>
      <SloFormComponent {...props} />
    </SloTrackerProvider>
  );
}
