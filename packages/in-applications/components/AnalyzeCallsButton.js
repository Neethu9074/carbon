/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Button } from '@instana/components';

import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { emptyArray } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connect(({ applicationId, serviceId, endpointId }) => {
  const observables = {};
  if (applicationId) {
    observables.applicationLabel = getApplication({ id: applicationId }).map(getLabel);
    observables.applicationBoundaryScope = getApplication({ id: applicationId }).map(getBoundaryScope);
  }
  if (serviceId) {
    observables.serviceLabel = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  if (endpointId) {
    observables.endpointLabel = getEndpointInfo({ id: endpointId }).map(getLabel);
  }
  return observables;
})(AnalyzeCallsButton);

function AnalyzeCallsButton({
  applicationLabel,
  applicationBoundaryScope,
  serviceLabel,
  endpointLabel,
  boundaryScope,
  formModel = emptyArray,
  includeSynthetic,
  groupBy
}) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  return (
    <Button
      kind="primary"
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

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

function getBoundaryScope(result) {
  return get(result, ['data', 'boundaryScope'], null);
}
