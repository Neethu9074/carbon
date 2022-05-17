/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ApdexWidget from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidget';
import { apdexWidgetEnabled } from 'in-services/featureFlags';

export default function ApdexWidgetPresenter() {
  if (!apdexWidgetEnabled) return;
  return <ApdexWidget />;
}
