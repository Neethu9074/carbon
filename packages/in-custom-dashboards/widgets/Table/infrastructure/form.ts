/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, createField, notBlankValidator } from 'formalistic';

import { defaultTableSize } from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableSizeConfigurator';
import { TableFormConfiguration } from 'in-custom-dashboards/widgets/Table/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';

export function createForm(form: MapForm<any>, savedState: Partial<TableFormConfiguration>) {
  return form
    .put(
      'entityType',
      createField({
        value: (savedState && savedState.entityType) || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, notBlankValidator)
      })
    )
    .put(
      'tableSize',
      createField({
        value: (savedState && savedState.tableSize) || defaultTableSize,
        validator: composeAndShortCircuitOnError(notUndefinedValidator)
      })
    );
}
