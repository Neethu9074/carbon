/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createForm as createChartForm } from 'in-custom-dashboards/widgets/Chart/form';
export { migrate, createMetricForm } from 'in-custom-dashboards/widgets/Chart/form';

export function createForm(savedState) {
  return createChartForm(savedState).remove('type');
}
