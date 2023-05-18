/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

import { ApplicationBoundaryScope, SloEntityType } from 'in-types';
// import { boundaryScopes } from 'in-applications/constants';

type AvailableBeaconTypes = 'httpRequest' | 'pageLoad' | 'custom';

export const sloBoundaryScopeKey = 'boundaryScope';
export const sloEntityTypeKey = 'entityType';
export const sloIncludeInternalKey = 'includeInternal';
export const sloIncludeSyntheticKey = 'includeSynthetic';

export type SloForm<EntityType extends SloEntityType> = EntityType extends 'application'
  ? ApplicationSloForm
  : WebsiteSloForm;

// export type EntityForm<EntityType extends SloEntityType> = EntityType extends 'application'
// ? ApplicationEntityForm
// : WebsiteEntityForm;

type SloCommonFields = {
  entityType: Field<SloEntityType>;
  target: Field<number>;
};

export type CommonSloForm = MapForm<{
  entityType: Field<SloEntityType>;
  target: Field<number>;
}>;

export type ApplicationSloForm = MapForm<
  {
    boundaryScope: Field<ApplicationBoundaryScope>;
    includeInternal: Field<boolean>;
    includeSynthetic: Field<boolean>;
  } & SloCommonFields
>;

export type WebsiteSloForm = MapForm<
  {
    beaconType: Field<AvailableBeaconTypes>;
  } & SloCommonFields
>;

interface CreateSloFormProps<EntityType> {
  entityType: EntityType;
}

interface ApplicationSloFields {
  boundaryScope: Field<ApplicationBoundaryScope>;
  includeInternal: Field<boolean>;
  includeSynthetic: Field<boolean>;
}

interface WebsiteSloFields {
  beaconType: Field<AvailableBeaconTypes>;
}

const commonFields: SloCommonFields = {
  entityType: createField<SloEntityType>({ value: 'application' }),
  target: createField<number>({ value: 0 })
};

const applicationSloFields: ApplicationSloFields = {
  boundaryScope: createField<ApplicationBoundaryScope>({ value: 'ALL' }),
  includeInternal: createField({ value: false }),
  includeSynthetic: createField({ value: false })
};

const websiteSloFields: WebsiteSloFields = {
  beaconType: createField<AvailableBeaconTypes>({ value: 'pageLoad' })
};

export function isApplicationSloForm(form: SloForm<SloEntityType>): form is SloForm<'application'> {
  const sloSloEntityTypeField = (form as unknown as CommonSloForm).get(sloEntityTypeKey);

  return sloSloEntityTypeField.value === 'application';
}

export function isWebsiteSloForm(form: SloForm<SloEntityType>): form is SloForm<'website'> {
  const sloSloEntityTypeField = (form as unknown as CommonSloForm).get(sloEntityTypeKey);

  return sloSloEntityTypeField.value === 'website';
}
export function createSloForm<EntityType extends SloEntityType>({
  entityType
}: CreateSloFormProps<EntityType>): SloForm<EntityType> {
  if (entityType === 'application') {
    return createMapForm({
      items: {
        ...commonFields,
        ...applicationSloFields
      }
    }) as SloForm<EntityType>;
  }

  return createMapForm({
    items: {
      ...commonFields,
      ...websiteSloFields
    }
  }) as SloForm<EntityType>;
}
