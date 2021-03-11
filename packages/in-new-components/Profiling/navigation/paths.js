/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  dataSource as dataSourceMatrixParameter,
  processId as processIdMatrixParameter,
  time as timeMatrixParameter,
  hotspotAutoExpandRowId as hotspotAutoExpandRowIdMatrixParameter
} from 'in-new-components/Profiling/navigation/matrix';
import { addOrDeleteHighlightedTimeframeToParams } from 'in-stores/highlightedTimeframe';
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

export function getLinkToProfiles({
  subPath = 'summary',
  hotspotAutoExpandRowId,
  processSnapshotId,
  time,
  start,
  end
}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${analyzeProfilePathFullyQualified}/${subPath || 'summary'}`;

    if (processSnapshotId) {
      setOrDeleteMatrixKey(params, profilingPath, processIdMatrixParameter, processSnapshotId);
    }
    if (start && end) {
      addOrDeleteHighlightedTimeframeToParams(params, start, end);
    }
    if (time) {
      setOrDeleteMatrixKey(params, profilingPath, timeMatrixParameter, time);
    }
    // we want to provide a jump from somewhere to the profiling summary page and auto expand a target row. For this,
    // we will transport the info within the URL as a matrix param which is bound to the summary path so it gets deleted
    // automatically when navigating away from the summary page
    if (hotspotAutoExpandRowId) {
      setOrDeleteMatrixKey(params, `/${subPath}`, hotspotAutoExpandRowIdMatrixParameter, hotspotAutoExpandRowId);
    }
  });
}
