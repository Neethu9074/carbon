/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createMapForm } from 'formalistic';

import { ApdexType } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';

export interface ApdexWidgetConfiguration {
  entityType: ApdexType;
  entityId: string;
  apdexConfigId: string;
}

export function createForm() {
  let form = createMapForm();

  return form;
}
