import {
  applicationId as applicationIdMatrixName,
  serviceId as serviceIdMatrixName,
  endpointId as endpointIdMatrixName
} from 'in-analyze/navigation/matrix';
import { analyze } from 'in-analyze/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getTimeframe } from 'in-stores/timeline';

// builds a filter object for backend data retrieval. Object is
// compatible with com.instana.ui.model.query.Filter.
export function buildFilter(location) {
  return {
    timeframe: getTimeframe(location),
    application: getMatrixParameter(location, analyze, applicationIdMatrixName),
    service: getMatrixParameter(location, analyze, serviceIdMatrixName),
    endpoint: getMatrixParameter(location, analyze, endpointIdMatrixName)
  };
}
