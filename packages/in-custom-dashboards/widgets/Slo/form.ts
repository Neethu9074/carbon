/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm, MapPath, createField, createMapForm, notBlankValidator } from 'formalistic';

import { SloEntityType } from '@instana/types';

import { notBlankSloValidator } from 'in-custom-dashboards/widgets/Slo/validators';
import { SloWidgetChartType } from 'in-custom-dashboards/widgets/Slo/constants';
import { SloWidgetConfiguration } from 'in-custom-dashboards/widgets/Slo/types';

export type SloWidgetFormFields = {
  entityType: Field<SloEntityType>;
  sloId: Field<string>;
  chartType: Field<SloWidgetChartType>;
};

export type SloWidgetFormPath = MapPath<SloWidgetFormFields>;
export interface SloWidgetForm extends MapForm<SloWidgetFormFields> {}

export function createForm(sloWidgetConfig?: SloWidgetConfiguration): SloWidgetForm {
  return createMapForm({
    items: {
      entityType: createField({
        value: sloWidgetConfig?.entityType ?? 'application',
        validator: notBlankValidator
      }),
      sloId: createField({
        value: sloWidgetConfig?.sloId ?? '',
        validator: notBlankSloValidator
      }),
      chartType: createField({
        value: sloWidgetConfig?.chartType ?? 'ERROR_BUDGET',
        validator: notBlankValidator
      })
    }
  });
}
