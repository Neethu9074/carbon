import {
  tagFilters as tagFiltersMatrixParameter,
  group as groupMatrixParameter,
  serializeGroup,
  dataSource as dataSourceMatrixParameter,
  processId as processIdMatrixParameter
} from 'in-profiling/navigation/matrix';
import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const profilingPath = '/profiles';

export const analyzePath = '/analyzeProfiles';
export const analyzePathFullyQualified = `${profilingPath}${analyzePath}`;

export const analyzeProfilePath = '/analyzeProfile';
export const analyzeProfilePathFullyQualified = `${analyzePathFullyQualified}${analyzeProfilePath}`;
export const isAnalyzeView = navigationParameters$.map(
  location => location.pathname.indexOf(analyzePathFullyQualified) === 0
);

export const closeProfilesViewLink = getModifiedUrlStream(params => (params.pathname = analyzePathFullyQualified));

export function getLinkToAnalyze({ group }) {
  return getModifiedUrlStream(params => {
    params.pathname = analyzePathFullyQualified;

    setOrDeleteMatrixKey(params, analyzePath, groupMatrixParameter, serializeGroup(group));
    setOrDeleteMatrixKey(params, analyzePath, dataSourceMatrixParameter, 'profiles');

    // reset sorting
    setOrDeleteMatrixKey(params, analyzePath, 'orderBy');
    setOrDeleteMatrixKey(params, analyzePath, 'orderDirection');

    setOrDeleteMatrixKey(params, analyzePath, tagFiltersMatrixParameter);
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
