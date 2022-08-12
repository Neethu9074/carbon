/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, MapForm, ValidationResult } from 'formalistic';

import {
  availabilityType,
  applicationType,
  websiteEventBased,
  websiteTimeBased,
  CombinedWebsiteSliEntity,
  CombinedApplicationSliEntity,
  SliConfig,
  CombinedSliEntity,
  SliType
} from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import {
  Application,
  AvailabilitySliEntity,
  SliConfigMetricConfiguration,
  TagFilterExpressionElementUnion,
  Website,
  WebsiteEventBasedSliEntity
} from 'in-types';
import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { MonitoredEntity } from 'in-custom-dashboards/widgets/Slo/hooks/useMonitoredEntity';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { numericValidator, minValidator } from 'in-services/validators/number';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
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

export function createForm(
  entityType: 'application',
  sliConfig: Partial<SliConfig<CombinedApplicationSliEntity>>,
  entityId: string,
  entity: Application
): MapForm;
export function createForm(
  entityType: 'website',
  sliConfig: Partial<SliConfig<CombinedWebsiteSliEntity>>,
  entityId: string,
  entity: Website
): MapForm;
export function createForm(
  entityType: MonitoringSource,
  sliConfig: Partial<SliConfig<CombinedSliEntity>>,
  entityId: string,
  entity: MonitoredEntity
): MapForm {
  const { id, sliName, sliEntity, metricConfiguration } = sliConfig;

  let form = createMapForm();

  if (id) {
    form = form.put('id', createField({ value: id }));
  }

  form = form.put(
    'sliName',
    createField({
      value: sliName ?? '',
      validator: composeAndShortCircuitOnError<string>(notUndefinedValidator, notBlankValidator)
    })
  );

  if (entityType === 'website') {
    form = form.put('sliEntity', createWebsiteSliEntityForm(sliEntity as CombinedWebsiteSliEntity, entityId));
  } else {
    form = form.put(
      'sliEntity',
      createApplicationSliEntityForm(sliEntity as CombinedApplicationSliEntity, entityId, entity as Application)
    );
  }

  const sliType = sliEntity?.sliType;
  if (sliType === applicationType || sliType === websiteTimeBased) {
    form = form.put('metricConfiguration', createMetricsForm(metricConfiguration ?? {}, sliType));
  }

  return form;
}

function createApplicationSliEntityForm(
  sliEntity: CombinedApplicationSliEntity,
  applicationId: string,
  application: Application
): MapForm {
  const { boundaryScope: apDefaultBoundaryScope } = application;
  const form = createMapForm()
    .put(
      'sliType',
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
      'applicationId',
      createField({
        value: applicationId
      })
    )
    .put(
      'serviceId',
      createField({
        value: sliEntity?.serviceId ?? null
      })
    )
    .put(
      'endpointId',
      createField({
        value: sliEntity?.endpointId ?? null
      })
    )
    .put(
      'boundaryScope',
      createField({
        value:
          sliEntity?.boundaryScope ??
          (apDefaultBoundaryScope === 'DEFAULT' ? boundaryScopes.inbound : apDefaultBoundaryScope)
      })
    )
    .put(
      'includeInternal',
      createField({
        value: Boolean(sliEntity?.includeInternal)
      })
    )
    .put(
      'includeSynthetic',
      createField({
        value: Boolean(sliEntity?.includeSynthetic)
      })
    );

  if (sliEntity?.sliType === availabilityType) {
    return addGoodBadEventsForm(form, sliEntity as AvailabilitySliEntity);
  }

  return form;
}

function createWebsiteSliEntityForm(sliEntity: CombinedWebsiteSliEntity, websiteId: string): MapForm {
  let form = createMapForm()
    .put(
      'sliType',
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
      'websiteId',
      createField({
        value: websiteId
      })
    )
    .put(
      'beaconType',
      createField({
        value: sliEntity?.beaconType ?? 'httpRequest' // TODO: the default value will be removed once we add the other option to choose beacon scope
      })
    )
    .put(
      'filterExpression',
      createField({
        value: fromBackendModel(sliEntity?.filterExpression)
      })
    );

  if (sliEntity?.sliType === websiteEventBased) {
    return addGoodBadEventsForm(form, sliEntity as WebsiteEventBasedSliEntity);
  }

  return form;
}

export function addGoodBadEventsForm(form: MapForm, sliEntity?: Partial<EventBasedSliEntity>) {
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
): MapForm {
  const defaults =
    sliType === websiteTimeBased
      ? { name: 'beaconErrorRate', aggregation: 'MEAN' } // website metrics
      : { name: 'latency', aggregation: 'P90' }; // application metrics

  return createMapForm()
    .put(
      'metricName',
      createField({
        validator: composeAndShortCircuitOnError(notBlankValidator, notUndefinedValidator),
        value: metricConfiguration.metricName ?? defaults.name
      })
    )
    .put(
      'metricAggregation',
      createField({
        validator: composeAndShortCircuitOnError(notBlankValidator, notUndefinedValidator),
        value: metricConfiguration.metricAggregation ?? defaults.aggregation
      })
    )
    .put(
      'threshold',
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
