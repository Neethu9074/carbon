/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import getServices from 'in-subscription/application/getServices';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

export default function ServicesSelectBox({ field, applicationId, boundaryScope, value, onChange }) {
  const timeConfig = useTimeConfig();

  const result = useObservable(getServicesObservable, [applicationId, boundaryScope, timeConfig]) ?? pendingResult;

  return (
    <SelectInSection
      id="new-sli-service-selection"
      label="Service"
      disabled={hasError(result) || isLoading(result)}
      value={value ?? ''}
      onChange={({ target }) => onChange?.(target?.value)}
      hasError={!field.valid && field.touched}
    >
      {isLoading(result) ? <option value="">{'<loading>'}</option> : <option value="">All Services</option>}
      {result.data?.items?.map(({ service }) => (
        <option value={service.id} key={service.id}>
          {service.label}
        </option>
      ))}
    </SelectInSection>
  );
}

function getServicesObservable([applicationId, boundaryScope, timeConfig]) {
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
      timeConfig
    },
    contextScope: 'NONE'
  });
}
