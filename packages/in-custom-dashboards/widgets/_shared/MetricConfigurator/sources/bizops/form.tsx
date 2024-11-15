/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';

//@ts-expect-error needs ts migration
import { migrate as migrateTagFilterArray } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form.js';
//@ts-expect-error needs ts migration
import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form.js';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';

interface State {
  compareToTimeShifted: boolean;
  label: string;
  source: string;
  timeShift: number;
}

export function createForm(form: MapForm<any>, savedState: State) {
  return addTagFilterExpressionField(form, savedState);
}

export function migrate(savedState: State) {
  return migrateTagFilterArray({
    savedState,
    getTagCatalog
  });
}
