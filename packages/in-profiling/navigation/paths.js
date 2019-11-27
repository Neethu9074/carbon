import {
  serializeTagFilters,
  deserializeTagFilters,
  tagFilters as tagFiltersMatrixParameter,
  group as groupMatrixParameter,
  serializeGroup,
  dataSource as dataSourceMatrixParameter,
  processId as processIdMatrixParameter
} from 'in-profiling/navigation/matrix';
import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey, getMatrixParameter } from 'in-stores/navigation/matrix';
import { callAnalysisBlacklistedTags } from 'in-applications/tags';

export const profilingPath = '/profiles';

export const analyzePath = '/analyzeProfiles';
export const analyzePathFullyQualified = `${profilingPath}${analyzePath}`;

export const analyzeProfilePath = '/analyzeProfile';
export const analyzeProfilePathFullyQualified = `${analyzePathFullyQualified}${analyzeProfilePath}`;
export const isAnalyzeView = navigationParameters$.map(
  location => location.pathname.indexOf(analyzePathFullyQualified) === 0
);

export const closeProfilesViewLink = getModifiedUrlStream(params => (params.pathname = analyzePathFullyQualified));

export function getLinkToAnalyze({ tagFilters, group }) {
  return getModifiedUrlStream(params => {
    params.pathname = analyzePathFullyQualified;

    setOrDeleteMatrixKey(params, analyzePath, groupMatrixParameter, serializeGroup(group));
    setOrDeleteMatrixKey(params, analyzePath, dataSourceMatrixParameter, 'profiles');

    // reset sorting
    setOrDeleteMatrixKey(params, analyzePath, 'orderBy');
    setOrDeleteMatrixKey(params, analyzePath, 'orderDirection');

    addTagFilterToURL(params, tagFilters);
  });
}

export function getLinkToProfiles({ processSnapshotId }) {
  return getModifiedUrlStream(params => {
    params.pathname = `${analyzeProfilePathFullyQualified}/cpu`;
    setOrDeleteMatrixKey(params, profilingPath, processIdMatrixParameter, processSnapshotId);

    // make sure that there is no grouping as otherwise the page load cannot be loaded.
    setOrDeleteMatrixKey(params, analyzePath, groupMatrixParameter, serializeGroup({}));
  });
}

function addTagFilterToURL(params, tagFilters) {
  if (tagFilters != null) {
    setOrDeleteMatrixKey(params, analyzePath, tagFiltersMatrixParameter, serializeTagFilters(tagFilters));
  } else {
    // remove blacklisted filters
    let existingTagFilters = deserializeTagFilters(getMatrixParameter(params, analyzePath, tagFiltersMatrixParameter));
    existingTagFilters = existingTagFilters.filter(t => callAnalysisBlacklistedTags.indexOf(t.name) === -1);
    setOrDeleteMatrixKey(params, analyzePath, tagFiltersMatrixParameter, serializeTagFilters(existingTagFilters));
  }
}
