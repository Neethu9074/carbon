/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm, MapPath, createField, createMapForm } from 'formalistic';

import { SloWidgetChartType } from 'in-custom-dashboards/widgets/Slo/constants';
import { SloWidgetConfiguration } from 'in-custom-dashboards/widgets/Slo/types';

export type SloWidgetFormFields = {
  sloId: Field<string>;
  chartType: Field<SloWidgetChartType | undefined>;
};

export type SloWidgetFormPath = MapPath<SloWidgetFormFields>;
export interface SloWidgetForm extends MapForm<SloWidgetFormFields> {}

export function createForm(sloWidgetConfig?: SloWidgetConfiguration): SloWidgetForm {
  return createMapForm({
    items: {
      sloId: createField({
        value: sloWidgetConfig?.sloId ?? ''
      }),
      chartType: createField({
        value: sloWidgetConfig?.chartType
      })
    }
  });
}
