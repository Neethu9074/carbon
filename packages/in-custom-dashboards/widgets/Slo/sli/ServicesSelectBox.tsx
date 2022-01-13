/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field } from 'formalistic';
import React from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { ApplicationBoundaryScope, PaginatedResult, Result, ServiceItem, TimeConfig } from 'in-types';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import getServices from 'in-applications/subscriptions/getServices';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface ServicesSelectBoxProps {
  field: Field<never>;
  applicationId: string;
  boundaryScope: ApplicationBoundaryScope;
  value?: string;
  onChange: (application?: string) => void;
}

export default function ServicesSelectBox({
  field,
  applicationId,
  boundaryScope,
  value,
  onChange
}: ServicesSelectBoxProps) {
  const timeConfig = useTimeConfig();

  const result: Result<PaginatedResult<ServiceItem>> =
    useObservable(getServicesObservable, [applicationId, boundaryScope, timeConfig]) ?? pendingResult;

  return (
    <SelectInSection
      id="new-sli-service-selection"
      label={t('in-custom-dashboards:widgets.slo.servicesSelectBox.service')}
      disabled={hasError(result) || isLoading(result)}
      value={value ?? ''}
      onChange={({ target }) => onChange?.(target?.value)}
      hasError={!field.valid && field.touched}
    >
      {isLoading(result) ? (
        <option value="">{t('in-custom-dashboards:widgets.slo.servicesSelectBox.loading')}</option>
      ) : (
        <option value="">{t('in-custom-dashboards:widgets.slo.servicesSelectBox.allServices')}</option>
      )}
      {result.data?.items?.map(({ service }) => (
        <option value={service.id} key={service.id}>
          {service.label}
        </option>
      ))}
    </SelectInSection>
  );
}

type GetServicesObservableProps = [string, ApplicationBoundaryScope, TimeConfig];

function getServicesObservable([applicationId, boundaryScope, timeConfig]: GetServicesObservableProps): Observable<
  Result<PaginatedResult<ServiceItem>>
> {
  return getServices({
    pagination: {
      page: 1,
      pageSize: 100
    },
    order: {
      by: 'serviceLabel',
      direction: 'ASC'
    },
    metrics: {
      applications: {
        metric: 'applications',
        aggregation: 'DISTINCT_COUNT'
      }
    },
    filter: {
      application: applicationId,
      applicationBoundaryScope: boundaryScope,
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    contextScope: 'NONE'
  });
}
