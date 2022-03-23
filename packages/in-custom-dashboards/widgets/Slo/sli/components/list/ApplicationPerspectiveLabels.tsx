/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { KeyValue } from '@instana/components';

import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getApplication from 'in-applications/subscriptions/getApplication';
import { Result } from 'in-types';

import locals from 'in-custom-dashboards/widgets/Slo/sli/components/list/SliManageList.mless';

interface LabelsProps {
  sliName: string;
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
}

export default function ApplicationPerspectiveLabels({ serviceId, endpointId, applicationId, sliName }: LabelsProps) {
  const applicationLabel = useObservable(() => {
    if (!applicationId) return undefined;
    return getApplication({ id: applicationId }).map(getLabel);
  }, [applicationId]);
  const serviceLabel = useObservable(() => {
    if (!serviceId) return undefined;
    return getServiceLabel({ id: serviceId }).map(getLabel);
  }, [serviceId]);
  const endpointLabel = useObservable(() => {
    if (!endpointId) return undefined;
    return getEndpointInfo({ id: endpointId }).map(getLabel);
  }, [endpointId]);

  let subscript = '';
  if (applicationLabel) {
    subscript = subscript + applicationLabel;
  }
  if (serviceLabel) {
    subscript = `${subscript} > ${serviceLabel}`;
  }
  if (endpointLabel) {
    subscript = `${subscript} > ${endpointLabel}`;
  }
  return <KeyValue label={subscript} value={sliName} className={locals.nameColumn} />;
}

function getLabel(result: Result<{ label?: string }>): string | null {
  return get(result, ['data', 'label'], null);
}
