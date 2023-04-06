/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, Item, MapForm, notBlankValidator } from 'formalistic';

import {
  ApdexConfigurationInput,
  ApplicationApdexEntity,
  ApplicationBoundaryScope,
  ApdexConfiguration,
  WebsiteApdexEntity
} from '@instana/types';

import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { numericValidator, positiveNumberValidator } from 'in-services/validators/number';
import { booleanValidator, stringValidator } from 'in-services/validators/jsonType';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { entityIdKey } from 'in-custom-dashboards/widgets/Apdex/form';
import { buildEnumValidator } from 'in-services/validators/enum';

export const apdexNameKey = 'apdexName';
export const apdexEntityKey = 'apdexEntity';
export const apdexTypeKey = 'apdexType';
export const beaconTypeKey = 'beaconType';
export const tagFilterExpressionKey = 'tagFilterExpression';
export const thresholdKey = 'threshold';
export const boundaryScopeKey = 'boundaryScope';
export const includeInternalKey = 'includeInternal';
export const includeSyntheticKey = 'includeSynthetic';

export function createForm(
  { apdexName, apdexEntity }: Partial<ApdexConfiguration>,
  entityType: ApdexEntityTypes,
  entityId: string
): MapForm<any> {
  const isWebsiteEntity = entityType === 'website';

  return createMapForm()
    .put(
      apdexNameKey,
      createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
        value: apdexName ?? ''
      })
    )
    .put(
      apdexEntityKey,
      isWebsiteEntity
        ? createWebsiteEntityForm(entityId, (apdexEntity as WebsiteApdexEntity) ?? {})
        : createApplicationEntityForm(entityId, (apdexEntity as ApplicationApdexEntity) ?? {})
    );
}

export function createWebsiteEntityForm(websiteId: string, apdexEntity: Partial<WebsiteApdexEntity>): MapForm<any> {
  return createMapForm()
    .put(
      entityIdKey,
      createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
        value: websiteId
      })
    )
    .put(
      apdexTypeKey,
      createField({
        value: 'website'
      })
    )
    .put(
      beaconTypeKey,
      createField({
        value: apdexEntity.beaconType ?? 'httpRequest'
      })
    )
    .put(
      tagFilterExpressionKey,
      createField({
        value: fromBackendModel(apdexEntity.tagFilterExpression || emptyTagFilterExpression)
      })
    )
    .put(
      thresholdKey,
      createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numericValidator, v =>
          positiveNumberValidator(Number(v))
        ),
        value: apdexEntity.threshold
      })
    );
}

export function createApplicationEntityForm(
  applicationId: string,
  apdexEntity: Partial<ApplicationApdexEntity>
): MapForm<any> {
  return createMapForm({
    items: {
      [apdexTypeKey]: createField({
        value: 'application'
      }),
      [entityIdKey]: createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator),
        value: applicationId
      }),
      [tagFilterExpressionKey]: createField({
        value: fromBackendModel(apdexEntity.tagFilterExpression || emptyTagFilterExpression)
      }),
      [thresholdKey]: createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numericValidator, v =>
          positiveNumberValidator(Number(v))
        ),
        value: apdexEntity.threshold
      }),
      [boundaryScopeKey]: createField({
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          buildEnumValidator<ApplicationBoundaryScope>(['ALL', 'INBOUND'])
        ),
        value: apdexEntity.boundaryScope || 'ALL'
      }),
      [includeInternalKey]: createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator),
        value: apdexEntity.includeInternal || false
      }),
      [includeSyntheticKey]: createField({
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator),
        value: apdexEntity.includeSynthetic || false
      })
    }
  });
}

export function toApdexConfigurationInput(form: Item): ApdexConfigurationInput {
  const formData = form.toJS();
  const { tagFilterExpression } = formData.apdexEntity;
  return {
    ...formData,
    apdexEntity: {
      ...formData.apdexEntity,
      tagFilterExpression: toBackendQueryModel(tagFilterExpression as FormModelElement[])
    }
  };
}
