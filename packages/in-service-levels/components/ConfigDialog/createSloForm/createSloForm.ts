/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ServiceLevelObjectiveConfiguration, SloEntityType } from '@instana/types';

import { createSloFormFromPreviousForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromPreviousForm';
import {
  ApplicationSloForm,
  SloForm,
  WebsiteSloForm
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { createSloFormFromSloConfig } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromSloConfig';
import { createSloFormFromForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromForm';
import { createDefaultSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createDefaultSloForm';

interface CreateSloFormProps<EntityType> {
  entityType: EntityType;
  form?: EntityType extends 'application' ? ApplicationSloForm : WebsiteSloForm;
  previousForm?: EntityType extends 'application' ? ApplicationSloForm : WebsiteSloForm;
  sloConfig?: Partial<ServiceLevelObjectiveConfiguration>;
}

// form creators
export function createSloForm<EntityType extends SloEntityType>({
  entityType,
  form,
  previousForm,
  sloConfig
}: CreateSloFormProps<EntityType>): SloForm<EntityType> {
  if (sloConfig) return createSloFormFromSloConfig({ entityType, sloConfig });

  if (form) return createSloFormFromForm(form);

  if (previousForm) return createSloFormFromPreviousForm({ entityType, previousForm });

  return createDefaultSloForm(entityType);
}
