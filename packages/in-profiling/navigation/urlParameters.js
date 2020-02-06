import { dataSource, processId, time } from 'in-profiling/navigation/matrix';
import { analyzePath, profilingPath } from 'in-profiling/navigation/paths';

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
