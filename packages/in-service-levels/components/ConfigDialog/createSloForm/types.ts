/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm, MapPath } from 'formalistic';

import { ApplicationBoundaryScope, SloEntityType } from '@instana/types';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { SloBeaconTypes } from 'in-service-levels/types';

export type SloForm<EntityType extends SloEntityType> = EntityType extends 'application'
  ? ApplicationSloForm
  : WebsiteSloForm;

export type SloFormPath<EntityType extends SloEntityType> = EntityType extends 'application'
  ? ApplicationSloFormPath
  : WebsiteSloFormPath;

// Field Types
export type SloCommonFields = {
  entityType: Field<SloEntityType>;
};

export type ApplicationEntityFields = {
  applicationId: Field<string>;
};

export type ApplicationScopeFields = {
  boundaryScope: Field<ApplicationBoundaryScope>;
  includeInternal: Field<boolean>;
  includeSynthetic: Field<boolean>;
  endpointId: Field<string>;
  serviceId: Field<string>;
  tagFilterExpression: Field<FormModelElement[]>;
};

export type WebsiteEntityFields = {
  websiteId: Field<string>;
};

export type WebsiteScopeFields = {
  beaconType: Field<SloBeaconTypes>;
  tagFilterExpression: Field<FormModelElement[]>;
};

// Form types
export type CommonSloForm = MapForm<{
  entityType: Field<SloEntityType>;
}>;

export type ApplicationSloFormPath = MapPath<
  {
    entity: ApplicationEntityForm;
    scope: ApplicationScopeForm;
  } & SloCommonFields
>;

export type ApplicationSloForm = MapForm<
  {
    entity: ApplicationEntityForm;
    scope: ApplicationScopeForm;
  } & SloCommonFields
>;

export type WebsiteSloFormPath = MapPath<
  {
    entity: WebsiteEntityForm;
    scope: WebsiteScopeForm;
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
  beaconType: Field<SloBeaconTypes>;
  tagFilterExpression: Field<FormModelElement[]>;
}>;

type ApplicationEntityForm = MapForm<{
  applicationId: Field<string>;
}>;

type ApplicationScopeForm = MapForm<{
  boundaryScope: Field<ApplicationBoundaryScope>;
  includeInternal: Field<boolean>;
  includeSynthetic: Field<boolean>;
  endpointId: Field<string>;
  serviceId: Field<string>;
  tagFilterExpression: Field<FormModelElement[]>;
}>;

export function isApplicationSloForm(form: SloForm<SloEntityType>): form is SloForm<'application'> {
  const sloSloEntityTypeField = form.get('entityType');

  return sloSloEntityTypeField.value === 'application';
}
