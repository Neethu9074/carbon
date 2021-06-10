/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Button } from '@instana/components';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import { syntheticCallsOptions } from 'in-applications/constants';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
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
  syntheticType,
  syntheticCalls,
  formModel = emptyArray,
  groupBy
}) {
  let syntheticOption = syntheticCallsOptions.exclude;
  if (syntheticCallsEnabled) {
    syntheticOption = syntheticCalls;
  } else if (syntheticType === 'SYNTHETIC') {
    syntheticOption = syntheticCallsOptions.only;
  }
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      href$={getLinkToAnalyze({
        applicationName: applicationLabel,
        serviceName: serviceLabel,
        endpointName: endpointLabel,
        boundaryScope: boundaryScope || applicationBoundaryScope,
        dataSource: 'calls',
        formModel: joinExpressions({ expressions: [formModel, createFormModelFromSyntheticOption(syntheticOption)] }),
        hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticOption),
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
