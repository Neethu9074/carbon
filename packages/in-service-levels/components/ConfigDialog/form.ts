/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

import { ApplicationBoundaryScope, ServiceLevelObjectiveConfiguration, SloEntityType } from 'in-types';

type AvailableBeaconTypes = 'httpRequest' | 'pageLoad' | 'custom';

export const sloEntityKey = 'entity';
export const sloScopeKey = 'scope';

export const sloBoundaryScopeKey = 'boundaryScope';
export const sloEntityTypeKey = 'entityType';
export const sloIncludeInternalKey = 'includeInternal';
export const sloIncludeSyntheticKey = 'includeSynthetic';
export const sloBeaconTypeKey = 'beaconType';
export const sloApplicationIdKey = 'applicationId';
export const sloWebsiteIdKey = 'websiteId';

export type SloForm<EntityType extends SloEntityType> = EntityType extends 'application'
  ? ApplicationSloForm
  : WebsiteSloForm;

interface CreateSloFormProps<EntityType> {
  entityType: EntityType;
  previousForm?: EntityType extends 'application' ? ApplicationSloForm : WebsiteSloForm;
  sloConfig?: Partial<ServiceLevelObjectiveConfiguration>;
}

// Field Types
type SloCommonFields = {
  entityType: Field<SloEntityType>;
  target: Field<number>;
};

type ApplicationEntityFields = {
  applicationId: Field<string>;
};

type ApplicationScopeFields = {
  boundaryScope: Field<ApplicationBoundaryScope>;
  includeInternal: Field<boolean>;
  includeSynthetic: Field<boolean>;
};

type WebsiteEntityFields = {
  websiteId: Field<string>;
};

type WebsiteScopeFields = {
  beaconType: Field<AvailableBeaconTypes>;
};

// Form types
export type CommonSloForm = MapForm<{
  entityType: Field<SloEntityType>;
  target: Field<number>;
}>;

export type ApplicationSloForm = MapForm<
  {
    entity: ApplicationEntityForm;
    scope: ApplicationScopeForm;
  } & SloCommonFields
>;

export type WebsiteSloForm = MapForm<
  {
    entity: WebsiteEntityForm;
    scope: WebsiteScopeForm;
  } & SloCommonFields
>;

type WebsiteEntityForm = MapForm<{
  websiteId: Field<string>;
}>;

type WebsiteScopeForm = MapForm<{
  beaconType: Field<AvailableBeaconTypes>;
}>;

type ApplicationEntityForm = MapForm<{
  applicationId: Field<string>;
}>;

type ApplicationScopeForm = MapForm<{
  boundaryScope: Field<ApplicationBoundaryScope>;
  includeInternal: Field<boolean>;
  includeSynthetic: Field<boolean>;
}>;

// Field declarations
const getCommonFields = (entityType: SloEntityType = 'application') => {
  return {
    entityType: createField<SloEntityType>({ value: entityType }),
    target: createField<number>({ value: 0 })
  };
};

const getWebsiteEntityFields = (form?: WebsiteSloForm): WebsiteEntityFields => {
  if (!form) {
    return {
      websiteId: createField({ value: '' })
    };
  }
  const prevWebsiteIdValue = form.getIn([sloEntityKey, sloWebsiteIdKey]).value;

  return {
    websiteId: createField({ value: prevWebsiteIdValue ?? '' })
  };
};

const getWebsiteScopeFields = (form?: WebsiteSloForm): WebsiteScopeFields => {
  if (!form)
    return {
      beaconType: createField({ value: 'httpRequest' })
    };

  const prevBeaconTypeValue = form.getIn([sloScopeKey, sloBeaconTypeKey]).value;

  return {
    beaconType: createField({ value: prevBeaconTypeValue })
  };
};

const getApplicationEntityFields = (form?: ApplicationSloForm): ApplicationEntityFields => {
  if (!form) return { applicationId: createField({ value: '' }) };

  const prevApplicationIdValue = form.getIn([sloEntityKey, sloApplicationIdKey]).value;

  return { applicationId: createField({ value: prevApplicationIdValue }) };
};

const getApplicationScopeFields = (form?: ApplicationSloForm): ApplicationScopeFields => {
  if (!form)
    return {
      boundaryScope: createField<ApplicationBoundaryScope>({ value: 'ALL' }),
      includeInternal: createField({ value: false }),
      includeSynthetic: createField({ value: false })
    };

  const prevScopeForm = form.get(sloScopeKey);
  const prevBoundaryScopeValue = prevScopeForm.get(sloBoundaryScopeKey).value;
  const prevIncludeInternalValue = prevScopeForm.get(sloIncludeInternalKey).value;
  const prevIncludeSyntheticValue = prevScopeForm.get(sloIncludeSyntheticKey).value;

  return {
    boundaryScope: createField<ApplicationBoundaryScope>({ value: prevBoundaryScopeValue }),
    includeInternal: createField({ value: prevIncludeInternalValue }),
    includeSynthetic: createField({ value: prevIncludeSyntheticValue })
  };
};

// type guards
export function isApplicationSloForm(form: SloForm<SloEntityType>): form is SloForm<'application'> {
  const sloSloEntityTypeField = form.get(sloEntityTypeKey);

  return sloSloEntityTypeField.value === 'application';
}

export function isWebsiteSloForm(form: SloForm<SloEntityType>): form is SloForm<'website'> {
  const sloSloEntityTypeField = (form as unknown as CommonSloForm).get(sloEntityTypeKey);

  return sloSloEntityTypeField.value === 'website';
}
// form creator
export function createSloForm<EntityType extends SloEntityType>({
  entityType,
  previousForm
}: CreateSloFormProps<EntityType>): SloForm<EntityType> {
  if (entityType === 'application') {
    return createMapForm({
      items: {
        ...getCommonFields(entityType),
        entity: createMapForm({
          items: getApplicationEntityFields(previousForm as ApplicationSloForm)
        }),
        scope: createMapForm({
          items: getApplicationScopeFields(previousForm as ApplicationSloForm)
        })
      }
    }) as SloForm<EntityType>;
  }

  return createMapForm({
    items: {
      ...getCommonFields(entityType),
      entity: createMapForm({
        items: getWebsiteEntityFields(previousForm as WebsiteSloForm)
      }),
      scope: createMapForm({
        items: getWebsiteScopeFields(previousForm as WebsiteSloForm)
      })
    }
  }) as SloForm<EntityType>;
}
