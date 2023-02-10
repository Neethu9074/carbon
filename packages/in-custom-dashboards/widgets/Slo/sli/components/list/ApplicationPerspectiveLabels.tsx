/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { ApplicationSliEntity, Result, SliEntityUnion } from '@instana/types';
import { useObservable } from '@instana/hooks';

import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getApplication from 'in-applications/subscriptions/getApplication';
import MonitoringEntityLabel from './MonitoringEntityLabel';

interface UseApplicationPerspectiveLabelsProps {
  sliEntity: ApplicationSliEntity;
}

type UseApplicationPerspectiveLabelsReturn = [string | undefined, string | undefined, string | undefined];

function useApplicationPerspectiveLabels({
  sliEntity
}: UseApplicationPerspectiveLabelsProps): UseApplicationPerspectiveLabelsReturn {
  const { applicationId, serviceId, endpointId } = sliEntity;
  const applicationLabels = useObservable(() => {
    if (!applicationId) return undefined;
    return getApplication({ id: applicationId }).map(getLabel);
  }, [applicationId]);
  const serviceLabels = useObservable(() => {
    if (!serviceId) return undefined;
    return getServiceLabel({ id: serviceId }).map(getLabel);
  }, [serviceId]);
  const endpointLabels = useObservable(() => {
    if (!endpointId) return undefined;
    return getEndpointInfo({ id: endpointId }).map(getLabel);
  }, [endpointId]);

  return [applicationLabels ?? undefined, serviceLabels ?? undefined, endpointLabels ?? undefined];
}

export interface SliEntityLabelProps<SLI_ENTITY extends SliEntityUnion> {
  sliName: string;
  sliEntity: SLI_ENTITY;
}
export function ApplicationPerspectiveLabel({ sliName, sliEntity }: SliEntityLabelProps<ApplicationSliEntity>) {
  const [applicationLabel, serviceLabel, endpointLabel] = useApplicationPerspectiveLabels({
    sliEntity
  });

  return (
    <MonitoringEntityLabel
      sliName={sliName}
      entityLabel={applicationLabel}
      endpointLabel={endpointLabel}
      serviceLabel={serviceLabel}
    />
  );
}
export function getLabel(result: Result<{ label?: string }>): string | null {
  return get(result, ['data', 'label'], null);
}
