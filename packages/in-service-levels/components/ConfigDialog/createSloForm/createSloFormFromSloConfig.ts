/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field } from 'formalistic';

import { ApplicationBoundaryScope, SloEntityType } from '@instana/types';

import {
  getDefaultApplicationEntityFields,
  getDefaultApplicationScopeFields,
  getDefaultCommonFields,
  getDefaultWebsiteEntityFields,
  getDefaultWebsiteScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createDefaultSloForm';
import {
  ApplicationEntityFields,
  ApplicationScopeFields,
  SloCommonFields,
  SloForm,
  WebsiteEntityFields,
  WebsiteScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { SloBeaconTypes, SloConfigType } from 'in-service-levels/types';

interface GetFieldsFromSloConfigProps {
  entityType: SloEntityType;
  sloConfig: SloConfigType;
}

export const getCommonFieldsFromSloConfig = ({
  entityType,
  sloConfig
}: GetFieldsFromSloConfigProps): SloCommonFields => {
  return {
    entityType: createField<SloEntityType>({ value: sloConfig?.entity?.type ?? entityType })
  };
};

export const getWebsiteEntityFieldsFromSloConfig = (sloConfig: SloConfigType): WebsiteEntityFields => {
  if (sloConfig.entity?.type === 'website') {
    return {
      websiteId: createField({ value: sloConfig.entity.websiteId })
    };
  }

  return getDefaultWebsiteEntityFields();
};

export const getWebsiteScopeFieldsFromSloConfig = (sloConfig: SloConfigType): WebsiteScopeFields => {
  if (sloConfig.entity?.type === 'website') {
    return {
      beaconType: createField({ value: sloConfig.entity.beaconType }) as Field<SloBeaconTypes>,
      tagFilterExpression: createField<FormModelElement[]>({ value: [] })
    };
  }

  return getDefaultWebsiteScopeFields();
};

export const getApplicationEntityFieldsFromSloConfig = (sloConfig: SloConfigType): ApplicationEntityFields => {
  if (sloConfig.entity?.type === 'application') {
    return {
      applicationId: createField({ value: sloConfig.entity.applicationId })
    };
  }

  return getDefaultApplicationEntityFields();
};

export const getApplicationScopeFieldsFromSloConfig = (sloConfig: SloConfigType): ApplicationScopeFields => {
  if (sloConfig?.entity?.type === 'application') {
    const { boundaryScope, endpointId, includeInternal, includeSynthetic, serviceId } = sloConfig.entity;

    return {
      boundaryScope: createField<ApplicationBoundaryScope>({ value: boundaryScope }),
      endpointId: createField({ value: endpointId ?? '' }),
      includeInternal: createField({ value: includeInternal ?? false }),
      includeSynthetic: createField({ value: includeSynthetic ?? false }),
      serviceId: createField({ value: serviceId ?? '' }),
      tagFilterExpression: createField({ value: [] })
    };
  }

  return getDefaultApplicationScopeFields();
};

export const createSloFormFromSloConfig = <EntityType extends SloEntityType>({
  entityType,
  sloConfig
}: GetFieldsFromSloConfigProps) => {
  if (entityType === 'application') {
    return createMapForm({
      items: {
        ...getCommonFieldsFromSloConfig({ entityType, sloConfig }),
        entity: createMapForm({
          items: getApplicationEntityFieldsFromSloConfig(sloConfig)
        }),
        scope: createMapForm({
          items: getApplicationScopeFieldsFromSloConfig(sloConfig)
        })
      }
    }) as SloForm<EntityType>;
  }

  return createMapForm({
    items: {
      ...getDefaultCommonFields(entityType),
      entity: createMapForm({
        items: getWebsiteEntityFieldsFromSloConfig(sloConfig)
      }),
      scope: createMapForm({
        items: getWebsiteScopeFieldsFromSloConfig(sloConfig)
      })
    }
  }) as SloForm<EntityType>;
};
