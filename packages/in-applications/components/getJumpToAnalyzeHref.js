import { combineLatest } from '@instana/observables';
import { get } from 'lodash';

import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { alwaysNull } from 'in-services/fixedStreams';

function getLabels({ applicationId, serviceId, endpointId }) {
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

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

export default function getJumpToAnalyzeHref$(ids, additionalParams) {
  return getLabels(ids).flatMap(({ applicationLabel, serviceLabel, endpointLabel }) =>
    getLinkToAnalyze({
      applicationName: applicationLabel,
      serviceName: serviceLabel,
      endpointName: endpointLabel,
      dataSource: 'calls',
      showGraph: true,
      ...additionalParams
    })
  );
}
