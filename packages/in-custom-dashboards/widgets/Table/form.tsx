/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, createField, createMapForm } from 'formalistic';

import { createForm as createInfraFormFields } from 'in-custom-dashboards/widgets/Table/infrastructure/form';
import { createForm as createEventFormFields } from 'in-custom-dashboards/widgets/Table/eventsTable/form';
import { TableFormConfiguration } from 'in-custom-dashboards/widgets/Table/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { dataSources } from 'in-custom-dashboards/widgets/Table/index';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';

export function createForm(savedState: Partial<TableFormConfiguration>) {
  const source = savedState?.source ?? '';

  let form: MapForm<any> = createMapForm({
    items: {
      source: createField<string>({
        value: source,
        validator: composeAndShortCircuitOnError(stringValidator, notBlankValidator)
      })
    }
  });

  if (source === dataSources.EVENTS.type) {
    form = createEventFormFields(form, savedState);
  }

  if (source === dataSources.INFRA.type) {
    form = createInfraFormFields(form, savedState);
  }

  return form;
}
