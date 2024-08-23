/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { ApplicationSliEntity, AvailabilitySliEntity, Result, SliEntityUnion } from '@instana/types';
import { useObservable } from '@instana/hooks';

import MonitoredEntityLabel from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/MonitoredEntityLabel';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getApplication from 'in-applications/subscriptions/getApplication';

interface UseApplicationPerspectiveLabelsProps {
  sliEntity: ApplicationSliEntity | AvailabilitySliEntity;
}

interface UseApplicationPerspectiveLabelsReturn {
  applicationLabel?: string;
  serviceLabel?: string;
  endpointLabel?: string;
}

function useApplicationPerspectiveLabels({
  sliEntity
}: UseApplicationPerspectiveLabelsProps): UseApplicationPerspectiveLabelsReturn {
  const { applicationId, serviceId, endpointId } = sliEntity;
  const applicationLabel =
    useObservable(() => {
      if (!applicationId) return undefined;
      return getApplication({ id: applicationId }).map(getLabel);
    }, [applicationId]) ?? undefined;
  const serviceLabel =
    useObservable(() => {
      if (!serviceId) return undefined;
      return getServiceLabel({ id: serviceId }).map(getLabel);
    }, [serviceId]) ?? undefined;
  const endpointLabel =
    useObservable(() => {
      if (!endpointId) return undefined;
      return getEndpointInfo({ id: endpointId }).map(getLabel);
    }, [endpointId]) ?? undefined;

  return { applicationLabel, serviceLabel, endpointLabel };
}

export interface SliEntityLabelProps<SLI_ENTITY extends SliEntityUnion> {
  sliName: string;
  sliEntity: SLI_ENTITY;
}
export function ApplicationPerspectiveLabel({
  sliName,
  sliEntity
}: SliEntityLabelProps<ApplicationSliEntity | AvailabilitySliEntity>) {
  const { applicationLabel, serviceLabel, endpointLabel } = useApplicationPerspectiveLabels({
    sliEntity
  });

  return (
    <MonitoredEntityLabel
      sliName={sliName}
      entityLabel={applicationLabel}
      endpointLabel={endpointLabel}
      serviceLabel={serviceLabel}
    />
  );
}
export function getLabel(result: Result<{ label?: string }>): string | undefined {
  return get(result, ['data', 'label'], null);
}
