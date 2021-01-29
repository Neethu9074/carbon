/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React from 'react';

import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import getServices from 'in-subscription/application/getServices';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import ComboBox from 'in-components/ComboBox';

export default function ChartSubEntitySelection({
  className,
  applicationId,
  boundaryScope,
  serviceId,
  setServiceId,
  tagFilterFormModel,
  queryWindowSize
}) {
  const result =
    useObservable(getServicesObservable, [applicationId, boundaryScope, tagFilterFormModel, queryWindowSize]) ??
    pendingResult;

  const options = result.data?.items?.map(({ service }) => ({ label: service.label, value: service.id }));
  const onChange = selection => {
    setServiceId(selection?.value);
  };

  const loadingOptions = [{ label: 'Loading…' }];
  return (
    <ComboBox
      disabled={hasError(result) || isLoading(result)}
      className={className}
      value={serviceId}
      options={isLoading(result) ? loadingOptions : options}
      optionRenderer={option => <IconLabel text={option.label} type={'lib_application_service'} />}
      onChange={onChange}
      placeholder={isLoading(result) ? 'Loading services…' : 'Select service to see a preview'}
      autoComplete
      autoFocus
      clearable
      searchable
    />
  );
}

function getServicesObservable([applicationId, boundaryScope, tagFilterFormModel, queryWindowSize]) {
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
      timeConfig: {
        windowSize: queryWindowSize
      }
    },
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel),
    contextScope: 'NONE'
  });
}
