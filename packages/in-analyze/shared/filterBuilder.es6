import {
  applicationId as applicationIdMatrixParameter,
  serviceId as serviceIdMatrixParameter,
  endpointId as endpointIdMatrixParameter,
  traceGroupName as traceGroupNameMatrixParameter
} from 'in-analyze/navigation/matrix';
import { analyze } from 'in-analyze/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getTimeConfig } from 'in-stores/time/config';

// builds a filter object for backend data retrieval. Object is
// compatible with com.instana.ui.model.query.Filter.
export function buildFilter(location) {
  return {
    timeConfig: getTimeConfig(location),
    application: getMatrixParameter(location, analyze, applicationIdMatrixParameter),
    service: getMatrixParameter(location, analyze, serviceIdMatrixParameter),
    endpoint: getMatrixParameter(location, analyze, endpointIdMatrixParameter),
    traceGroupName: getMatrixParameter(location, analyze, traceGroupNameMatrixParameter)
  };
}
