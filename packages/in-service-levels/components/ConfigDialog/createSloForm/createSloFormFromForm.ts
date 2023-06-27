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
  ApplicationSloForm,
  SloCommonFields,
  SloForm,
  WebsiteEntityFields,
  WebsiteScopeFields,
  WebsiteSloForm,
  isApplicationSloForm
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

export const getCommonFieldsFromForm = <EntityType extends SloEntityType>(
  form: SloForm<EntityType>
): SloCommonFields => {
  const entityTypeField = form.get('entityType');

  return { entityType: createField<SloEntityType>({ value: entityTypeField.value }) };
};

export const getWebsiteEntityFieldsFromForm = (form: WebsiteSloForm): WebsiteEntityFields => {
  const websiteIdValue = form.getIn(['entity', 'websiteId']).value;

  return { websiteId: createField({ value: websiteIdValue }) };
};

export const getWebsiteScopeFieldsFromForm = (form: WebsiteSloForm): WebsiteScopeFields => {
  const beaconTypeValue = form.getIn(['scope', 'beaconType']).value;
  const tagFilterExpressionValue = form.getIn(['scope', 'tagFilterExpression']).value;

  return {
    beaconType: createField({ value: beaconTypeValue }),
    tagFilterExpression: createField<FormModelElement[]>({ value: tagFilterExpressionValue })
  };
};

export const getApplicationEntityFieldsFromForm = (form: ApplicationSloForm): ApplicationEntityFields => {
  const applicationIdValue = form.getIn(['entity', 'applicationId']).value;

  return { applicationId: createField({ value: applicationIdValue }) };
};

export const getApplicationScopeFieldsFromForm = (form: ApplicationSloForm): ApplicationScopeFields => {
  const boundaryScopeValue = form.getIn(['scope', 'boundaryScope']).value;
  const endpointIdValue = form.getIn(['scope', 'endpointId']).value;
  const includeInternalValue = form.getIn(['scope', 'includeInternal']).value;
  const includeSyntheticValue = form.getIn(['scope', 'includeSynthetic']).value;
  const serviceIdValue = form.getIn(['scope', 'serviceId']).value;
  const tagFilterExpressionValue = form.getIn(['scope', 'tagFilterExpression']).value;

  return {
    boundaryScope: createField<ApplicationBoundaryScope>({ value: boundaryScopeValue }),
    endpointId: createField({ value: endpointIdValue }),
    includeInternal: createField({ value: includeInternalValue }),
    includeSynthetic: createField({ value: includeSyntheticValue }),
    serviceId: createField({ value: serviceIdValue }),
    tagFilterExpression: createField({ value: tagFilterExpressionValue })
  };
};

export const createSloFormFromForm = <EntityType extends SloEntityType>(form: SloForm<EntityType>) => {
  if (isApplicationSloForm(form)) {
    return createMapForm({
      items: {
        ...getCommonFieldsFromForm(form),
        entity: createMapForm({
          items: getApplicationEntityFieldsFromForm(form)
        }),
        scope: createMapForm({
          items: getApplicationScopeFieldsFromForm(form)
        })
      }
    }) as SloForm<EntityType>;
  }

  return createMapForm({
    items: {
      ...getCommonFieldsFromForm(form),
      entity: createMapForm({
        items: getWebsiteEntityFieldsFromForm(form)
      }),
      scope: createMapForm({
        items: getWebsiteScopeFieldsFromForm(form)
      })
    }
  }) as SloForm<EntityType>;
};
