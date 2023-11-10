/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';

// @ts-expect-error module needs to be translated to TS
import { migrate as migrateTagFilterArray } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
// @ts-expect-error module needs to be translated to TS
import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { getSyntheticTagCatalog } from 'in-synthetics/api';

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
    getSyntheticTagCatalog
  });
}
