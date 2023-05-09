/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';

import { combineLatest } from '@instana/observables';

import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { GetLinkToAnalyzeProps } from 'in-applications/navigation/paths';
import { alwaysNull } from 'in-services/fixedStreams';
import { Result } from 'in-types';

export interface GetLabelsProps {
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
}

function getLabels({ applicationId, serviceId, endpointId }: GetLabelsProps) {
  return combineLatest([
    applicationId ? getApplication({ id: applicationId }).map(getLabel) : alwaysNull,
    serviceId ? getServiceLabel({ id: serviceId }).map(getLabel) : alwaysNull,
    endpointId ? getEndpointInfo({ id: endpointId }).map(getLabel) : alwaysNull
  ]).map(([applicationLabel, serviceLabel, endpointLabel]) => ({
    applicationLabel,
    serviceLabel,
    endpointLabel
  }));
}

interface ResultWithLabel {
  label: string;
}

function getLabel(result: Result<ResultWithLabel>) {
  return get(result, ['data', 'label'], null);
}

export default function getJumpToAnalyzeHref$(
  ids: GetLabelsProps,
  additionalParams: any,
  getLinkToApplicationAnalyze: (props: Partial<GetLinkToAnalyzeProps>) => string
) {
  return getLabels(ids).map(({ applicationLabel, serviceLabel, endpointLabel }) =>
    getLinkToApplicationAnalyze({
      applicationName: applicationLabel,
      serviceName: serviceLabel,
      endpointName: endpointLabel,
      dataSource: 'calls',
      ...additionalParams
    })
  );
}
