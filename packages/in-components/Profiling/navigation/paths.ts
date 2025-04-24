/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  dataSource as dataSourceMatrixParameter,
  processId as processIdMatrixParameter,
  time as timeMatrixParameter,
  hotspotAutoExpandRowId as hotspotAutoExpandRowIdMatrixParameter
} from 'in-components/Profiling/navigation/matrix';
import { addOrDeleteHighlightedTimeframeToParams } from 'in-stores/highlightedTimeframe';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const profilingPath = '/profiles';

export const analyzePath = '/analyzeProfiles';
export const analyzePathFullyQualified = `${profilingPath}${analyzePath}`;

export const analyzeProfilePath = '/analyzeProfile';
export const analyzeProfilePathFullyQualified = `${analyzePathFullyQualified}${analyzeProfilePath}`;
export const isAnalyzeView = navigationParameters$.map(
  location => location.pathname.indexOf(analyzePathFullyQualified) === 0
);

export const useCloseProfilesViewLink = () => {
  const { location, createHref } = useNavigation();
  location.pathname = analyzePathFullyQualified;

  return createHref(location);
};

export function useLinkToAnalyze() {
  const { location, createHref } = useNavigation();
  location.pathname = analyzePathFullyQualified;
  setOrDeleteMatrixKey(location, analyzePath, dataSourceMatrixParameter, 'profiles');
  return createHref(location);
}

export function useLinkToProfiles({
  subPath = 'summary',
  hotspotAutoExpandRowId,
  processSnapshotId,
  time,
  start,
  end
}: UseLinkToProfiles) {
  const { location, createHref } = useNavigation();
  location.pathname = `${analyzeProfilePathFullyQualified}/${subPath || 'summary'}`;
  delete location.query['tl.tf'];

  if (processSnapshotId) {
    setOrDeleteMatrixKey(location, profilingPath, processIdMatrixParameter, processSnapshotId);
  }
  if (start && end) {
    addOrDeleteHighlightedTimeframeToParams(location, start, end);
  }
  if (time) {
    setOrDeleteMatrixKey(location, profilingPath, timeMatrixParameter, time);
  }
  // we want to provide a jump from somewhere to the profiling summary page and auto expand a target row. For this,
  // we will transport the info within the URL as a matrix param which is bound to the summary path so it gets deleted
  // automatically when navigating away from the summary page
  if (hotspotAutoExpandRowId) {
    setOrDeleteMatrixKey(location, `/${subPath}`, hotspotAutoExpandRowIdMatrixParameter, hotspotAutoExpandRowId);
  }
  return createHref(location);
}

interface UseLinkToProfiles {
  subPath: string;
  hotspotAutoExpandRowId: string;
  processSnapshotId: number;
  time: number;
  start: number;
  end: number;
}
