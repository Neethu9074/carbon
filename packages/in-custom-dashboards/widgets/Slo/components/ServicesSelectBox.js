import React from 'react';

import DropDownMock from 'in-custom-dashboards/widgets/Slo/components/DropDownMock';
import getServices from 'in-subscription/application/getServices';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

export default function ServicesSelectBox({ applicationId, boundaryScope, value, onChange }) {
  const timeConfig = useTimeConfig();
  const services$ = getServices({
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

  const services = useObservable(services$, [applicationId, boundaryScope, timeConfig]) ?? pendingResult;
  const { progress, errors, data } = services;
  const serviceItems = data?.items?.map(({ service }) => ({ value: service.id, label: service.label }));

  if (progress?.loading) return <DropDownMock options={[{ value: '', label: '<loading>' }]} disabled />;

  return (
    <>
      {
        <DropDownMock
          disabled={errors && errors?.length !== 0}
          options={[
            { value: undefined, label: 'Please select' },
            { value: '', label: 'All Services' },
            ...(serviceItems ?? [])
          ]}
          value={value ?? ''}
          onChange={({ target }) => onChange?.(target?.value)}
        />
      }
    </>
  );
}
