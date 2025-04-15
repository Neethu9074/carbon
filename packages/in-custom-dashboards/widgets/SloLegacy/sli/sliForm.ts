/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, MapForm, ValidationResult } from 'formalistic';

import {
  Application,
  AvailabilitySliEntity,
  SliConfigMetricConfiguration,
  TagFilterExpressionElementUnion,
  Website,
  WebsiteEventBasedSliEntity,
  ApplicationSliEntity
} from '@instana/types';

import {
  availabilityType,
  applicationType,
  websiteEventBased,
  websiteTimeBased,
  CombinedWebsiteSliEntity,
  CombinedApplicationSliEntity,
  isAvailabilitySliEntity,
  SliConfig,
  CombinedSliEntity,
  SliType,
  isWebsiteEventBasedSliEntity,
  isWebsiteTimeBasedSliEntity,
  NewSliConfig
} from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { numericValidator, minValidator } from 'in-services/validators/number';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { SloMonitoredEntity } from 'in-service-levels/types';
import { boundaryScopes } from 'in-applications/constants';
import { t } from 'in-i18n';

interface EventBasedSliEntity {
  readonly badEventFilterExpression: TagFilterExpressionElementUnion;
  readonly goodEventFilterExpression: TagFilterExpressionElementUnion;
}

export interface SliFormData<SLI_TYPE extends SliType> {
  id: string;
  sliName: string;
  sliEntity: SLI_TYPE extends 'application' ? ApplicationSliEntityFormData : WebsiteSliEntityFormData;
  metricConfiguration?: SliConfigMetricConfiguration;
}

export interface ApplicationSliEntityFormData
  extends Omit<CombinedApplicationSliEntity, 'goodEventFilterExpression' | 'badEventFilterExpression'> {
  readonly badEventFilterExpression?: FormModelElement[];
  readonly goodEventFilterExpression?: FormModelElement[];
}

export interface WebsiteSliEntityFormData
  extends Omit<
    CombinedWebsiteSliEntity,
    'filterExpression' | 'goodEventFilterExpression' | 'badEventFilterExpression'
  > {
  readonly filterExpression?: FormModelElement[];
  readonly badEventFilterExpression?: FormModelElement[];
  readonly goodEventFilterExpression?: FormModelElement[];
}

export const sliFieldNames = Object.freeze({
  goodEventFilterExpression: 'goodEventFilterExpression',
  badEventFilterExpression: 'badEventFilterExpression'
} as const);

export const sliApplicationIdKey = 'applicationId';
export const sliBeasonTypeKey = 'beaconType';
export const sliBoundaryScopeKey = 'boundaryScope';
export const sliEndpointIdKey = 'endpointId';
export const sliFilterExpressionKey = 'filterExpression';
export const sliIncludeInternalKey = 'includeInternal';
export const sliIncludeSyntheticKey = 'includeSynthetic';
export const sliMetricAggregationKey = 'metricAggregation';
export const sliMetricConfigurationKey = 'metricConfiguration';
export const sliMetricNameKey = 'metricName';
export const sliServiceIdKey = 'serviceId';
export const sliSliEntityKey = 'sliEntity';
export const sliSliNameKey = 'sliName';
export const sliSliTypeKey = 'sliType';
export const sliThresholdnKey = 'threshold';
export const sliWebsiteIdKey = 'websiteId';

export function createForm(
  entityType: 'application',
  sliConfig: Partial<SliConfig<CombinedApplicationSliEntity>>,
  entityId: string,
  entity: Application
): MapForm<any>;
export function createForm(
  entityType: 'website',
  sliConfig: Partial<SliConfig<CombinedWebsiteSliEntity>>,
  entityId: string,
  entity: Website
): MapForm<any>;
export function createForm(
  entityType: MonitoringSource,
  sliConfig: Partial<SliConfig<CombinedSliEntity>>,
  entityId: string,
  entity: SloMonitoredEntity
): MapForm<any> {
  const { id, sliName, sliEntity, metricConfiguration } = sliConfig;

  let form = createMapForm<any>();

  if (id) {
    form = form.put('id', createField({ value: id }));
  }

  form = form.put(
    sliSliNameKey,
    createField({
      value: sliName ?? '',
      validator: composeAndShortCircuitOnError<string>(notUndefinedValidator, notBlankValidator)
    })
  );

  if (entityType === 'website') {
    form = form.put(sliSliEntityKey, createWebsiteSliEntityForm(sliEntity as CombinedWebsiteSliEntity, entityId));
  } else {
    form = form.put(
      sliSliEntityKey,
      createApplicationSliEntityForm(sliEntity as CombinedApplicationSliEntity, entityId, entity as Application)
    );
  }

  const sliType = sliEntity?.sliType;
  if (sliType === applicationType || sliType === websiteTimeBased) {
    form = form.put(sliMetricConfigurationKey, createMetricsForm(metricConfiguration ?? {}, sliType));
  }

  return form;
}

function createApplicationSliEntityForm(
  sliEntity: CombinedApplicationSliEntity,
  applicationId: string,
  application: Application
): MapForm<any> {
  const { boundaryScope: apDefaultBoundaryScope } = application;
  const form = createMapForm()
    .put(
      sliSliTypeKey,
      createField({
        validator: composeAndShortCircuitOnError<string>(
          notUndefinedValidator,
          notNullValidator,
          buildEnumValidator([applicationType, availabilityType])
        ),
        value: sliEntity?.sliType ?? null
      })
    )
    .put(
      sliApplicationIdKey,
      createField({
        value: applicationId
      })
    )
    .put(
      sliServiceIdKey,
      createField({
        value: sliEntity?.serviceId ?? null
      })
    )
    .put(
      sliEndpointIdKey,
      createField({
        value: sliEntity?.endpointId ?? null
      })
    )
    .put(
      sliBoundaryScopeKey,
      createField({
        value:
          sliEntity?.boundaryScope ??
          (apDefaultBoundaryScope === 'DEFAULT' ? boundaryScopes.inbound : apDefaultBoundaryScope)
      })
    )
    .put(
      sliIncludeInternalKey,
      createField({
        value: Boolean(sliEntity?.includeInternal)
      })
    )
    .put(
      sliIncludeSyntheticKey,
      createField({
        value: Boolean(sliEntity?.includeSynthetic)
      })
    );

  if (sliEntity?.sliType === availabilityType) {
    return addGoodBadEventsForm(form, sliEntity as AvailabilitySliEntity);
  }

  return form;
}

function createWebsiteSliEntityForm(sliEntity: CombinedWebsiteSliEntity, websiteId: string): MapForm<any> {
  let form = createMapForm()
    .put(
      sliSliTypeKey,
      createField({
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          notNullValidator,
          buildEnumValidator([websiteTimeBased, websiteEventBased])
        ),
        value: sliEntity?.sliType ?? null
      })
    )
    .put(
      sliWebsiteIdKey,
      createField({
        value: websiteId
      })
    )
    .put(
      sliBeasonTypeKey,
      createField({
        value: sliEntity?.beaconType ?? 'httpRequest' // TODO: the default value will be removed once we add the other option to choose beacon scope
      })
    )
    .put(
      sliFilterExpressionKey,
      createField({
        value: fromBackendModel(sliEntity?.filterExpression)
      })
    );

  if (sliEntity?.sliType === websiteEventBased) {
    return addGoodBadEventsForm(form, sliEntity as WebsiteEventBasedSliEntity);
  }

  return form;
}

export function addGoodBadEventsForm(form: MapForm<any>, sliEntity?: Partial<EventBasedSliEntity>) {
  return form
    .put(
      sliFieldNames.goodEventFilterExpression,
      createField({
        validator: noEmptyFilterExpressionValidator,
        value: fromBackendModel(sliEntity?.goodEventFilterExpression)
      })
    )
    .put(
      sliFieldNames.badEventFilterExpression,
      createField({
        validator: noEmptyFilterExpressionValidator,
        value: fromBackendModel(sliEntity?.badEventFilterExpression)
      })
    );
}

export function createMetricsForm(
  metricConfiguration: Partial<SliConfigMetricConfiguration>,
  sliType: string
): MapForm<any> {
  const defaults =
    sliType === websiteTimeBased
      ? { name: 'beaconErrorRate', aggregation: 'MEAN' } // website metrics
      : { name: 'latency', aggregation: 'P90' }; // application metrics

  return createMapForm()
    .put(
      sliMetricNameKey,
      createField({
        validator: composeAndShortCircuitOnError(notBlankValidator, notUndefinedValidator),
        value: metricConfiguration.metricName ?? defaults.name
      })
    )
    .put(
      sliMetricAggregationKey,
      createField({
        validator: composeAndShortCircuitOnError(notBlankValidator, notUndefinedValidator),
        value: metricConfiguration.metricAggregation ?? defaults.aggregation
      })
    )
    .put(
      sliThresholdnKey,
      createField({
        validator: composeAndShortCircuitOnError(notBlankValidator, notUndefinedValidator, numericValidator, v =>
          minValidator(0)(Number(v))
        ),
        value: metricConfiguration.threshold ?? ''
      })
    );
}

const notNullValidator = (v: any): ValidationResult => {
  if (v === null) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:widgets.slo.aValueMustBeSelected')
      }
    ];
  }
  return null;
};

const noEmptyFilterExpressionValidator = (model: FormModelElement[]): ValidationResult => {
  if (model?.find(element => element.type === 'TAG_FILTER')) return null;
  return [
    {
      severity: 'error',
      message: t('in-custom-dashboards:widgets.slo.atLeastOneFilterExpressionMustBeConfigured')
    }
  ];
};

export function toWebsiteSliConfiguration(formData: SliFormData<'website'>): NewSliConfig<CombinedWebsiteSliEntity> {
  const sliEntity = formData.sliEntity;

  if (isWebsiteTimeBasedSliEntity(sliEntity)) {
    const { filterExpression, ...entity } = sliEntity as Omit<
      WebsiteSliEntityFormData,
      'goodEventFilterExpression' | 'badEventFilterExpression'
    >;
    return {
      ...formData,
      sliEntity: {
        ...entity,
        filterExpression: toBackendQueryModel(filterExpression)
      }
    };
  }

  if (isWebsiteEventBasedSliEntity(sliEntity)) {
    const { goodEventFilterExpression, badEventFilterExpression, ...entity } = sliEntity as Omit<
      WebsiteSliEntityFormData,
      'filterExpression'
    >;
    return {
      ...formData,
      sliEntity: {
        ...entity,
        goodEventFilterExpression: toBackendQueryModel(goodEventFilterExpression),
        badEventFilterExpression: toBackendQueryModel(badEventFilterExpression)
      }
    };
  }

  return undefined as never;
}

export function toApplicationSliConfiguration(
  formData: SliFormData<'application'>
): NewSliConfig<CombinedApplicationSliEntity> {
  const sliEntity = formData.sliEntity;

  if (isAvailabilitySliEntity(sliEntity)) {
    return {
      ...formData,
      sliEntity: {
        ...sliEntity,
        goodEventFilterExpression: toBackendQueryModel(sliEntity.goodEventFilterExpression),
        badEventFilterExpression: toBackendQueryModel(sliEntity.badEventFilterExpression)
      }
    };
  }

  return formData as NewSliConfig<ApplicationSliEntity>;
}
