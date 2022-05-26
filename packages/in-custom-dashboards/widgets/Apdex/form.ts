/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, Field, Item, MapForm, notBlankValidator } from 'formalistic';

import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';

export const entityTypeKey = 'entityType';
export const apdexConfigIdKey = 'apdexConfigId';
export const entityIdKey = 'entityId';

export interface ApdexWidgetConfiguration {
  [entityTypeKey]: ApdexEntityTypes;
  [apdexConfigIdKey]: string;
  [entityIdKey]: string;
}

export function createForm(savedState: Partial<ApdexWidgetConfiguration> = {}) {
  return createMapForm()
    .put(
      entityTypeKey,
      createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
        value: savedState[entityTypeKey]
      })
    )
    .put(
      entityIdKey,
      createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
        value: savedState[entityIdKey]
      })
    )
    .put(
      apdexConfigIdKey,
      createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
        value: savedState[apdexConfigIdKey]
      })
    );
}

export function getField<T>(form: MapForm, field: string): Field<T> | undefined {
  return form.get(field) as Field<T> | undefined;
}

export function setFieldValue<T>(field: Item, value: T, isTouched = false): Field<T> {
  const updatedField = (field as Field<T>).setValue(value);
  if (!isTouched) return updatedField;
  return updatedField.setTouched(true);
}

export function updateFormField<T>(form: MapForm, path: string, value: T, isTouched = false) {
  return form.updateIn([path], field => setFieldValue<T>(field, value, isTouched));
}
