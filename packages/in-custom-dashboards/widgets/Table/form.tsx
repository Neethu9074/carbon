/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

import {
  createForm as createConfigurationForm,
  TableSubConfiguration
} from 'in-custom-dashboards/widgets/Table/eventsTable/form';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { dataSources } from 'in-custom-dashboards/widgets/Table/index';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';

interface TableConfiguration {
  source: string;
  childConfiguration?: TableSubConfiguration;
}

export function createForm(savedState: TableConfiguration | undefined): MapForm<{
  source: Field<string>;
  childConfiguration?: MapForm<{
    dynamicFocusQuery: Field<string>;
    columns: Field<string[]>;
  }>;
  type?: Field<string>;
}> {
  const source = savedState?.source ?? '';

  let form: MapForm<{ source: Field<string> }> = createMapForm({
    items: {
      source: createField<string>({
        value: source,
        validator: composeAndShortCircuitOnError(stringValidator, notBlankValidator)
      })
    }
  });

  if (source === dataSources.EVENTS.type) {
    return form.put('childConfiguration', createConfigurationForm(savedState?.childConfiguration)) as MapForm<{
      source: Field<string>;
      childConfiguration?: MapForm<{
        dynamicFocusQuery: Field<string>;
        columns: Field<string[]>;
      }>;
    }>;
  }

  return form;
}
