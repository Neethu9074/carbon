/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function EndpointSelectBox({ applicationId, field, serviceId, boundaryScope, value, onChange }) {
  const timeConfig = useTimeConfig();
  const result =
    useObservable(getEndpointsObservable, [applicationId, serviceId, boundaryScope, timeConfig]) ?? pendingResult;

  return (
    <SelectInSection
      id="new-sli-endpoint-selection"
      label={t('in-custom-dashboards:widgets.slo.endpointSelectBox.endpoint')}
      disabled={hasError(result) || isLoading(result)}
      value={value ?? ''}
      onChange={({ target }) => onChange?.(target?.value)}
      hasError={!field.valid && field.touched}
    >
      {isLoading(result) ? (
        <option value="">{t('in-custom-dashboards:widgets.slo.endpointSelectBox.loading')}</option>
      ) : (
        <option value="">{t('in-custom-dashboards:widgets.slo.endpointSelectBox.allEndpoints')}</option>
      )}
      {result.data?.items?.map(({ endpoint }) => (
        <option value={endpoint.id} key={endpoint.id}>
          {endpoint.label}
        </option>
      ))}
    </SelectInSection>
  );
}

function getEndpointsObservable([applicationId, serviceId, boundaryScope, timeConfig]) {
  return getEndpoints({
    pagination: {
      page: 1,
      pageSize: 100
    },
    order: {
      by: 'endpointLabel',
      direction: 'ASC'
    },
    metrics: {
      applications: {
        metric: 'applications',
        aggregation: 'DISTINCT_COUNT'
      }
    },
    filter: {
      service: serviceId,
      application: applicationId,
      applicationBoundaryScope: boundaryScope,
      timeConfig
    },
    contextScope: 'NONE'
  });
}
