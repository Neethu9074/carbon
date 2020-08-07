import React from 'react';

import { hotspotAutoExpandRowId as hotspotAutoExpandRowIdMatrixParameter } from 'in-new-components/Profiling/navigation/matrix';
import { cpuColorMapper, memColorMapper, timeColorMapper } from 'in-profiling/analyze/AnalyzeView/colors';
import StackTrace from 'in-profiling/analyze/AnalyzeView/ProfilesView/Hotspot/StackTrace';
import { getLinkToProfiles } from 'in-new-components/Profiling/navigation/paths';
import HotspotList from 'in-new-components/Profiling/components/HotspotList';
import ViewAllWrapper from 'in-new-components/TopListCard/ViewAllWrapper';
import { serializeLine } from 'in-new-components/StackTrace/serializer';
import { getTopSelfTimeList } from 'in-new-components/Profiling/utils';
import { buildJsonParser } from 'in-stores/navigation/matrix';
import { percentage } from 'in-services/formatters/number';
import { Col, Row } from 'in-new-components/layout/Grid';
import SetBodyColor from 'in-components/SetBodyColor';
import useUrlState from 'in-hooks/useUrlState';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

import locals from './View.mless';

export default function HotspotView({ profiles }) {
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

  return (
    <div className={locals.wrapper}>
      <SetBodyColor color="#F7F9FA" />

      <Row>
        <Hotspot
          title="CPU"
          profile={profiles.cpuProfile}
          getColorFn={cpuColorMapper}
          viewAllHref$={getLinkToProfiles({ subPath: 'cpu' })}
          hotspotAutoExpandRowConfig={hotspotAutoExpandRowConfig}
        />
        <Hotspot
          title="Memory"
          profile={profiles.memoryProfile}
          getColorFn={memColorMapper}
          viewAllHref$={getLinkToProfiles({ subPath: 'memory' })}
          hotspotAutoExpandRowConfig={hotspotAutoExpandRowConfig}
        />
        <Hotspot
          title="Wait Time"
          profile={profiles.timeProfile}
          getColorFn={timeColorMapper}
          viewAllHref$={getLinkToProfiles({ subPath: 'time' })}
          hotspotAutoExpandRowConfig={hotspotAutoExpandRowConfig}
        />
      </Row>
    </div>
  );
}

function Hotspot({ title, profile, viewAllHref$, hotspotAutoExpandRowConfig, getColorFn }) {
  if (!profile) {
    return null;
  }

  const { enrichedProfilesWithSelfTimes, allProfilesWithSelfTimes } = getTopSelfTimeList(profile);

  return (
    <Col xs={4}>
      <Card title={`${title} Hotspots`}>
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
