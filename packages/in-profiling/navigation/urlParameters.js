import { analyzePath, profilingPath } from 'in-profiling/navigation/paths';
import { dataSource, processId } from 'in-profiling/navigation/matrix';

export const analyzeDataSourceUrlParameter = {
  path: analyzePath,
  name: dataSource,
  initialState: 'profiles'
};

export const processIdUrlParameter = {
  path: profilingPath,
  name: processId
};
