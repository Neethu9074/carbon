/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, notBlankValidator } from 'formalistic';

import { ServiceLevelIndicatorType, ServiceLevelObjectiveConfiguration, SloEntityType } from '@instana/types';

import {
  CustomBlueprintType,
  SloForm,
  SloIndicatorFields,
  SloNameTagsFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import createSloFormFromPreviousForm from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromPreviousForm';
import { createSloFormFromSloConfig } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromSloConfig';
import { createSloFormFromForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromForm';
import { createDefaultSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createDefaultSloForm';
import { createThresholdFieldValidator } from 'in-service-levels/components/ConfigDialog/createSloForm/validator';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';

interface CreateSloFormProps {
  entityType?: SloEntityType;
  form?: SloForm;
  previousForm?: SloForm;
  sloConfig?: ServiceLevelObjectiveConfiguration;
}

export function createSloForm({ entityType, form, previousForm, sloConfig }: CreateSloFormProps): SloForm {
  if (sloConfig) return createSloFormFromSloConfig(sloConfig);

  if (form) return createSloFormFromForm(form);

  if (previousForm) return createSloFormFromPreviousForm(previousForm);

  if (entityType) return createDefaultSloForm(entityType);

  throw new Error('You have to pass at least one param to the function');
}

export function createSloNameTagsFields({
  name,
  tags
}: Pick<ServiceLevelObjectiveConfiguration, 'name' | 'tags'>): SloNameTagsFields {
  return {
    name: createField({
      value: name,
      validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
    }),
    tags: createField({ value: tags })
  };
}

interface CreateIndicatorThresholdFieldProps {
  value: number | undefined;
  touched?: boolean;
  blueprint: CustomBlueprintType;
  indicatorType: ServiceLevelIndicatorType;
}
export function createIndicatorThresholdField({
  value,
  touched,
  blueprint,
  indicatorType
}: CreateIndicatorThresholdFieldProps): SloIndicatorFields['threshold'] {
  return createField({
    value,
    validator: createThresholdFieldValidator(blueprint, indicatorType),
    touched
  });
}
