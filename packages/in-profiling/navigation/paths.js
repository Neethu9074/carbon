import {
  dataSource as dataSourceMatrixParameter,
  processId as processIdMatrixParameter,
  time as timeMatrixParameter
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

export function getLinkToAnalyze() {
  return getModifiedUrlStream(params => {
    params.pathname = analyzePathFullyQualified;

    setOrDeleteMatrixKey(params, analyzePath, dataSourceMatrixParameter, 'profiles');
  });
}

export function getLinkToProfiles({ processSnapshotId, time }) {
  return getModifiedUrlStream(params => {
    params.pathname = `${analyzeProfilePathFullyQualified}/cpu`;
    setOrDeleteMatrixKey(params, profilingPath, processIdMatrixParameter, processSnapshotId);
    if (time) {
      setOrDeleteMatrixKey(params, profilingPath, timeMatrixParameter, time);
    }
  });
}
