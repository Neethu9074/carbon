/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useEffect } from 'react';

import { hotspotAutoExpandRowId as hotspotAutoExpandRowIdMatrixParameter } from 'in-new-components/Profiling/navigation/matrix';
import { cpuColorMapper, memColorMapper, timeColorMapper } from 'in-profiling/analyze/AnalyzeView/colors';
import { OverviewProfileChart } from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileChart';
import ResultForTimeSelectionIndicator from 'in-new-components/ResultForTimeSelectionIndicator';
import StackTrace from 'in-profiling/analyze/AnalyzeView/ProfilesView/Hotspot/StackTrace';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { getLinkToProfiles } from 'in-new-components/Profiling/navigation/paths';
import HotspotList from 'in-new-components/Profiling/components/HotspotList';
import ViewAllWrapper from 'in-new-components/TopListCard/ViewAllWrapper';
import { serializeLine } from 'in-new-components/StackTrace/serializer';
import { getTopSelfTimeList } from 'in-new-components/Profiling/utils';
import { buildJsonParser } from 'in-stores/navigation/matrix';
import { percentage } from 'in-services/formatters/number';
import { formatTime } from 'in-services/formatters/date';
import { Col, Row } from 'in-new-components/layout/Grid';
import { overviewOpened } from 'in-profiling/tracker';
import SetBodyColor from 'in-components/SetBodyColor';
import { isLoading } from 'in-services/util/result';
import useUrlState from 'in-hooks/useUrlState';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

import locals from './View.mless';

export default function HotspotView({
  profiles,
  profilesForHighlightedTimeframeResult,
  timeConfig,
  highlightedTimeframe,
  processId
}) {
  const [urlState] = useUrlState({
    bind: [
      {
        path: '/summary',
        name: hotspotAutoExpandRowIdMatrixParameter,
        as: 'hotspotAutoExpandRow',
        initialState: null,
        parser: buildJsonParser()
      }
    ]
  });

  const hotspotAutoExpandRowConfig = urlState?.hotspotAutoExpandRow;
  const isLoadingProfilesForHighlightedTimeframe = isLoading(profilesForHighlightedTimeframeResult);
  useEffect(
    () =>
      overviewOpened(
        profiles?.cpuProfile?.runtime ?? profiles?.memoryProfile?.runtime ?? profiles?.timeProfile?.runtime
      ),
    // We deliberately only want to report this once when the view is opened
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={locals.wrapper}>
      <SetBodyColor color="#F7F9FA" />

      <Row>
        <Col xs={12}>
          <Card>
            <OverviewProfileChart profiles={profiles} timeConfig={timeConfig} processId={processId} />
          </Card>
        </Col>
      </Row>

      {!isLoadingProfilesForHighlightedTimeframe && profilesForHighlightedTimeframeResult && (
        <Row>
          <Col xs={12}>
            <Card>
              <ResultForTimeSelectionIndicator
                className={locals.timeselectionIndicator}
                message={
                  !profilesForHighlightedTimeframeResult.data ||
                  Object.keys(profilesForHighlightedTimeframeResult.data).length === 0
                    ? `There are no profiles in the selected timeframe (${formatTime(
                        highlightedTimeframe[0]
                      )} - ${formatTime(highlightedTimeframe[1])}). Showing all instead.`
                    : `Showing profiles for selection (${formatTime(highlightedTimeframe[0])} - ${formatTime(
                        highlightedTimeframe[1]
                      )})`
                }
              />
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Hotspot
          title="CPU"
          profile={profiles.cpuProfile}
          getColorFn={cpuColorMapper}
          viewAllHref$={getLinkToProfiles({ subPath: 'cpu' })}
          hotspotAutoExpandRowConfig={hotspotAutoExpandRowConfig}
          isLoadingProfilesForHighlightedTimeframe={isLoadingProfilesForHighlightedTimeframe}
          profileForHighlightedTimeframe={profilesForHighlightedTimeframeResult?.data?.cpuProfile}
        />
        <Hotspot
          title="Memory"
          profile={profiles.memoryProfile}
          getColorFn={memColorMapper}
          viewAllHref$={getLinkToProfiles({ subPath: 'memory' })}
          hotspotAutoExpandRowConfig={hotspotAutoExpandRowConfig}
          isLoadingProfilesForHighlightedTimeframe={isLoadingProfilesForHighlightedTimeframe}
          profileForHighlightedTimeframe={profilesForHighlightedTimeframeResult?.data?.memoryProfile}
        />
        <Hotspot
          title="Wait Time"
          profile={profiles.timeProfile}
          getColorFn={timeColorMapper}
          viewAllHref$={getLinkToProfiles({ subPath: 'time' })}
          hotspotAutoExpandRowConfig={hotspotAutoExpandRowConfig}
          isLoadingProfilesForHighlightedTimeframe={isLoadingProfilesForHighlightedTimeframe}
          profileForHighlightedTimeframe={profilesForHighlightedTimeframeResult?.data?.timeProfile}
        />
      </Row>
    </div>
  );
}

function Hotspot({
  title,
  profile,
  viewAllHref$,
  hotspotAutoExpandRowConfig,
  getColorFn,
  isLoadingProfilesForHighlightedTimeframe,
  profileForHighlightedTimeframe
}) {
  if (!profile) {
    return null;
  }

  profile =
    !isLoadingProfilesForHighlightedTimeframe && profileForHighlightedTimeframe
      ? profileForHighlightedTimeframe
      : profile;
  const { enrichedProfilesWithSelfTimes, allProfilesWithSelfTimes } = getTopSelfTimeList(profile);

  return (
    <Col xs={4}>
      <Card title={`${title} Hotspots`}>
        {isLoadingProfilesForHighlightedTimeframe ? (
          <HorizontalFlexWrapper className={locals.contentLoadingWrapper}>
            <LoadingIndicator width={150} height={150} text="Loading profiles" />
          </HorizontalFlexWrapper>
        ) : (
          <div className={locals.content}>
            <div className={locals.hotspotLine}>{renderSelfTimeComponents(allProfilesWithSelfTimes, getColorFn)}</div>
            <HotspotList
              profile={profile}
              hotspots={enrichedProfilesWithSelfTimes}
              hotspotAutoExpandRowConfig={hotspotAutoExpandRowConfig}
              renderNestedContent={_profile => <StackTrace profile={_profile} />}
            />
            <ViewAllWrapper renderViewAll={ViewAll} viewAllHref$={viewAllHref$} />
          </div>
        )}
      </Card>
    </Col>
  );
}

function renderSelfTimeComponents(profilesWithSelfTimes, getColorFn) {
  const highestSelfTime =
    profilesWithSelfTimes.length > 0
      ? profilesWithSelfTimes.map(p => p.selfTime).reduce((a, b) => (a > b ? a : b), 0)
      : 0;

  let selfTimeCursor = 0;
  return (
    <>
      {profilesWithSelfTimes.map((profile, i) => {
        const normalizedSelfTime = profile.selfTime;
        const selfTime = normalizedSelfTime * 100;

        selfTimeCursor += selfTime;
        const percentageLabel = percentage.detailed(normalizedSelfTime);

        return (
          <Tooltip
            key={i}
            themeStyle="light"
            content={`${serializeLine(profile.fileName, profile.methodName, profile.fileLine)} (${percentageLabel})`}
          >
            <div
              className={locals.item}
              style={{
                background: getColorFn(normalizedSelfTime / highestSelfTime),
                left: selfTimeCursor - selfTime + '%',
                width: selfTime + '%'
              }}
            />
          </Tooltip>
        );
      })}
    </>
  );
}

function ViewAll({ viewAllHref$ }, className) {
  return (
    <Link className={className} href$={viewAllHref$}>
      View all
    </Link>
  );
}
