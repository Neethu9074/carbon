import { dataSource, processId, time, threshold } from 'in-profiling/navigation/matrix';
import { analyzePath, profilingPath } from 'in-profiling/navigation/paths';
import { intParser } from 'in-stores/navigation/urlParameterUtils';

export const analyzeDataSourceUrlParameter = {
  path: analyzePath,
  name: dataSource,
  initialState: 'profiles'
};

export const processIdUrlParameter = {
  path: profilingPath,
  name: processId
};

export const timeUrlParameter = {
  path: profilingPath,
  name: time
};

export const thresholdUrlParameter = {
  path: profilingPath,
  name: threshold,

  parser: intParser,
  initialState: 1
};
