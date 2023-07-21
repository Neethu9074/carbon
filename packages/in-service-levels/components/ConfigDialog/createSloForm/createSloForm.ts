/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ServiceLevelObjectiveConfiguration, SloEntityType } from '@instana/types';

import { createSloFormFromPreviousForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromPreviousForm';
import { createSloFormFromSloConfig } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromSloConfig';
import { createSloFormFromForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromForm';
import { createDefaultSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createDefaultSloForm';
import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';

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
