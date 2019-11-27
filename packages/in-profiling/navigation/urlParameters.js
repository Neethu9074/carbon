import { getTagFilterFromUrlString, getTagFilterToUrlString } from 'in-analyze/filterBuilder';
import {
  tagFilters,
  group,
  serializeGroup,
  deserializeGroup,
  dataSource,
  processId
} from 'in-profiling/navigation/matrix';
import { analyzePath, profilingPath } from 'in-profiling/navigation/paths';

export const analyzeTagFiltersUrlParameter = {
  path: analyzePath,
  name: tagFilters,
  initialState: [],
  parser: getTagFilterFromUrlString,
  serializer: getTagFilterToUrlString
};

export const analyzeGroupingUrlParameter = {
  path: analyzePath,
  name: group,
  initialState: {},
  parser: deserializeGroup,
  serializer: serializeGroup
};

export const analyzeDataSourceUrlParameter = {
  path: analyzePath,
  name: dataSource,
  initialState: 'profiles'
};

export const analyzeOrderByUrlParameter = {
  path: analyzePath,
  name: 'orderBy'
};

export const analyzeOrderDirectionUrlParameter = {
  path: analyzePath,
  name: 'orderDirection',
  initialState: 'DESC'
};

export const processIdUrlParameter = {
  path: profilingPath,
  name: processId
};
