import {
  applicationId as applicationIdMatrixParameter,
  serviceId as serviceIdMatrixParameter,
  endpointId as endpointIdMatrixParameter,
  traceGroupName as traceGroupNameMatrixParameter
} from 'in-analyze/navigation/matrix';
import { analyze } from 'in-analyze/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getTimeframe } from 'in-stores/timeline';

// builds a filter object for backend data retrieval. Object is
// compatible with com.instana.ui.model.query.Filter.
export function buildFilter(location) {
  return {
    timeframe: getTimeframe(location),
    application: getMatrixParameter(location, analyze, applicationIdMatrixParameter),
    service: getMatrixParameter(location, analyze, serviceIdMatrixParameter),
    endpoint: getMatrixParameter(location, analyze, endpointIdMatrixParameter),
    traceGroupName: getMatrixParameter(location, analyze, traceGroupNameMatrixParameter)
  };
}
