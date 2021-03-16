/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { dataSource, processId, time, threshold } from 'in-new-components/Profiling/navigation/matrix';
import { analyzePath, profilingPath } from 'in-new-components/Profiling/navigation/paths';
import { numberParser } from 'in-stores/navigation/urlParameterUtils';

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
  parser: Number,
  serializer: v => Number(v).toString(),
  name: time
};

export const thresholdUrlParameter = {
  path: profilingPath,
  name: threshold,

  parser: numberParser,
  initialState: 1
};
