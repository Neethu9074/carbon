/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';

//@ts-expect-error needs ts migration
import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form.js';

interface State {
  compareToTimeShifted: boolean;
  label: string;
  source: string;
  timeShift: number;
}

export function createForm(form: MapForm<any>, savedState: State) {
  return addTagFilterExpressionField(form, savedState);
}
