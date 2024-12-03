/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { ApplicationBoundaryScope, Group } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { emptyArray } from 'in-services/fixedObjects';
import { WithLabel } from 'in-applications/types';
import { t } from 'in-i18n';

interface AnalyzeCallsButtonProps {
  applicationId: string;
  serviceId?: string | null;
  endpointId?: string;
  boundaryScope: ApplicationBoundaryScope;
  includeSynthetic?: boolean;
  formModel?: any;
  groupBy: Partial<Group>;
}
export default function AnalyzeCallsButton({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  formModel = emptyArray,
  includeSynthetic,
  groupBy
}: AnalyzeCallsButtonProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const application = useObservable(() => getApplicationObservable(applicationId), [applicationId]);
  const serviceLabel = useObservable(getServiceLabelObservable(serviceId), [serviceId]);
  const endpointLabel = useObservable(getEndpointLabelObservable(endpointId), [endpointId]);
  const applicationLabel = application?.data?.label;
  const applicationBoundaryScope = application?.data?.boundaryScope;
  return (
    <Button
      kind="action"
      size="compact"
      icon="lib_application_call"
      href={getLinkToApplicationAnalyze({
        applicationName: applicationLabel,
        serviceName: serviceLabel,
        endpointName: endpointLabel,
        boundaryScope: boundaryScope || applicationBoundaryScope,
        dataSource: 'calls',
        formModel: joinExpressions({ expressions: [formModel] }),
        hiddenCalls: { includeSynthetic: includeSynthetic },
        groupBy
      })}
    >
      {t('in-applications:buttonAnalyzeCalls')}
    </Button>
  );
}

function getLabel(result: WithLabel) {
  return get(result, ['data', 'label'], null);
}

function getApplicationObservable(id?: string) {
  if (!id) {
    return null;
  }
  return getApplication({ id });
}

function getServiceLabelObservable(id?: string | null) {
  if (!id) {
    return null;
  }
  return getServiceLabel({ id }).map(getLabel);
}

function getEndpointLabelObservable(id?: string | null) {
  if (!id) {
    return null;
  }
  return getEndpointInfo({ id }).map(getLabel);
}
