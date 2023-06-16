/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';

import { ApplicationBoundaryScope, SloEntityType } from '@instana/types';

import {
  ApplicationEntityFields,
  ApplicationScopeFields,
  SloCommonFields,
  SloForm,
  WebsiteEntityFields,
  WebsiteScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

// Field declarations
export const getDefaultCommonFields = (entityType?: SloEntityType): SloCommonFields => ({
  entityType: createField<SloEntityType>({ value: entityType ?? 'application' })
});

export const getDefaultWebsiteEntityFields = (): WebsiteEntityFields => ({
  websiteId: createField({ value: '' })
});

export const getDefaultWebsiteScopeFields = (): WebsiteScopeFields => ({
  beaconType: createField({ value: 'httpRequest' }),
  tagFilterExpression: createField<FormModelElement[]>({ value: [] })
});

export const getDefaultApplicationEntityFields = (): ApplicationEntityFields => ({
  applicationId: createField({ value: '' })
});

export const getDefaultApplicationScopeFields = (): ApplicationScopeFields => ({
  boundaryScope: createField<ApplicationBoundaryScope>({ value: 'ALL' }),
  endpointId: createField({ value: '' }),
  includeInternal: createField({ value: false }),
  includeSynthetic: createField({ value: false }),
  serviceId: createField({ value: '' }),
  tagFilterExpression: createField<FormModelElement[]>({ value: [] })
});

export const createDefaultSloForm = <EntityType extends SloEntityType>(entityType: EntityType) => {
  if (entityType === 'application') {
    return createMapForm({
      items: {
        ...getDefaultCommonFields(entityType),
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
