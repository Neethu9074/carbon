import React from 'react';

import FormDropDown from 'in-custom-dashboards/widgets/Slo/components/FormDropDown';
import getServices from 'in-subscription/application/getServices';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

export default function ServicesSelectBox({ applicationId, boundaryScope, value, onChange }) {
  const timeConfig = useTimeConfig();

  const services = useObservable(getServicesObservable, [applicationId, boundaryScope, timeConfig]) ?? pendingResult;

  const { data } = services;
  const serviceItems = data?.items?.map(({ service }) => ({ value: service.id, label: service.label }));

  if (isLoading(services)) {
    return <FormDropDown options={[{ value: '', label: '<loading>' }]} disabled />;
  }

  return (
    <FormDropDown
      disabled={hasError(services)}
      options={[{ value: '', label: 'All Services' }, ...(serviceItems ?? [])]}
      value={value ?? ''}
      onChange={({ target }) => onChange?.(target?.value)}
    />
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
