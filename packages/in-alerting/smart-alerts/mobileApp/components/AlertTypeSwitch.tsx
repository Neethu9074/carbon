/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MobileAlertType } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';

interface AlertTypeSwitchProps {
  alertType: MobileAlertType;
  renderStatusCode?: () => JSX.Element;
  renderThroughput?: () => JSX.Element;
  renderCustomEvent?: () => JSX.Element;
  renderCrash?: () => JSX.Element;
}

export default function AlertTypeSwitch({
  alertType,
  renderStatusCode,
  renderThroughput,
  renderCustomEvent,
  renderCrash
}: AlertTypeSwitchProps) {
  let render;
  if (alertType === 'statusCode') {
    render = renderStatusCode;
  } else if (alertType === 'throughput') {
    render = renderThroughput;
  } else if (alertType === 'customEvent') {
    render = renderCustomEvent;
  } else if (alertType === 'crash') {
    render = renderCrash;
  }
  return render?.() ?? null;
}
