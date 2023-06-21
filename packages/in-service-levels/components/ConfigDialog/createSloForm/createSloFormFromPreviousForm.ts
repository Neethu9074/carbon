/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';

import { SloEntityType } from '@instana/types';

import {
  getDefaultApplicationEntityFields,
  getDefaultApplicationScopeFields,
  getDefaultCommonFields,
  getDefaultWebsiteEntityFields,
  getDefaultWebsiteScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createDefaultSloForm';
import {
  ApplicationSloForm,
  SloCommonFields,
  SloForm,
  WebsiteSloForm
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';

interface GetFieldsFromSloPreviousFormProps<EntityType extends SloEntityType> {
  entityType: SloEntityType;
  previousForm: EntityType extends 'application' ? ApplicationSloForm : WebsiteSloForm;
}

export const getCommonFieldsFromPreviousForm = <EntityType extends SloEntityType>(
  previousForm: EntityType extends 'application' ? ApplicationSloForm : WebsiteSloForm
): SloCommonFields => {
  const entityTypeField = previousForm.get('entityType');

  return { entityType: createField<SloEntityType>({ value: entityTypeField.value }) };
};

export const createSloFormFromPreviousForm = <EntityType extends SloEntityType>({
  entityType,
  previousForm
}: GetFieldsFromSloPreviousFormProps<EntityType>) => {
  if (entityType === 'application') {
    return createMapForm({
      items: {
        ...getCommonFieldsFromPreviousForm(previousForm),
        entity: createMapForm({
          items: getDefaultApplicationEntityFields()
        }),
        scope: createMapForm({
          items: getDefaultApplicationScopeFields()
        })
      }
    }) as SloForm<EntityType>;
  }

  return createMapForm({
    items: {
      ...getDefaultCommonFields(entityType),
      entity: createMapForm({
        items: getDefaultWebsiteEntityFields()
      }),
      scope: createMapForm({
        items: getDefaultWebsiteScopeFields()
      })
    }
  }) as SloForm<EntityType>;
};
