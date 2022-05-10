/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

interface AlertTypeSwitchProps {
  alertType: string;
  renderJsErrors?: () => React.ReactNode;
  renderSlowness?: () => React.ReactNode;
  renderStatusCode?: () => React.ReactNode;
  renderThroughput?: () => React.ReactNode;
  renderCustomEvent?: () => React.ReactNode;
}

export default function AlertTypeSwitch({
                                          alertType,
                                          renderJsErrors,
                                          renderSlowness,
                                          renderStatusCode,
                                          renderThroughput,
                                          renderCustomEvent
                                        }: AlertTypeSwitchProps) {
  let render;
  if (alertType === 'specificJsError') {
    render = renderJsErrors;
  } else if (alertType === 'statusCode') {
    render = renderStatusCode;
  } else if (alertType === 'slowness') {
    render = renderSlowness;
  } else if (alertType === 'throughput') {
    render = renderThroughput;
  } else if (alertType === 'customEvent') {
    render = renderCustomEvent;
  }
  return render?.() ?? null;
}
