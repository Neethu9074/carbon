/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, MapForm, notBlankValidator } from 'formalistic';

import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { minValidator, numericValidator } from 'in-services/validators/number';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { entityIdKey } from 'in-custom-dashboards/widgets/Apdex/form';
import { stringValidator } from 'in-services/validators/jsonType';
import { ApdexConfiguration, ApdexEntityUnion } from 'in-types';

export const apdexNameKey = 'apdexName';
export const apdexEntityKey = 'apdexEntity';
export const apdexTypeKey = 'apdexType';
export const beaconTypeKey = 'beaconType';
export const tagFilterExpressionKey = 'tagFilterExpression';
export const thresholdKey = 'threshold';

export function createForm(
  { apdexName, apdexEntity }: Partial<ApdexConfiguration>,
  entityType: ApdexEntityTypes,
  entityId: string
): MapForm {
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
      isWebsiteEntity ? createWebsiteEntityForm(entityId, apdexEntity ?? {}) : createApplicationEntityForm()
    );
}

export function createWebsiteEntityForm(websiteId: string, apdexEntity: Partial<ApdexEntityUnion>): MapForm {
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
        value: 'httpRequest'
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
          minValidator(0)(Number(v))
        ),
        value: apdexEntity.threshold
      })
    );
}

export function createApplicationEntityForm(): MapForm {
  return createMapForm();
}
