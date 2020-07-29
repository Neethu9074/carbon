import React from 'react';

import { cpuColorMapper, memColorMapper, timeColorMapper } from 'in-profiling/analyze/AnalyzeView/colors';
import FileNameAndLine from 'in-profiling/analyze/AnalyzeView/ProfilesView/FileNameAndLine';
import StackTrace from 'in-profiling/analyze/AnalyzeView/ProfilesView/Hotspot/StackTrace';
import MethodName from 'in-profiling/analyze/AnalyzeView/ProfilesView/MethodName';
import ViewAllWrapper from 'in-new-components/TopListCard/ViewAllWrapper';
import { Ul, Li, ColumnizedContent } from 'in-new-components/lists/List';
import { serializeLine } from 'in-new-components/StackTrace/serializer';
import At from 'in-profiling/analyze/AnalyzeView/ProfilesView/At';
import { getLinkToProfile } from 'in-profiling/navigation/paths';
import { percentage } from 'in-services/formatters/number';
import { Col, Row } from 'in-new-components/layout/Grid';
import SetBodyColor from 'in-components/SetBodyColor';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

import locals from './View.mless';

const selfTimeThreshold = 0.05;

export default function HotspotView({ profiles }) {
  return (
    <div className={locals.wrapper}>
      <SetBodyColor color="#F7F9FA" />

      <Row>
        <Hotspot
          title="CPU"
          profile={profiles.cpuProfile}
          getColorFn={cpuColorMapper}
          viewAllHref$={getLinkToProfile('cpu')}
        />
        <Hotspot
          title="Memory"
          profile={profiles.memoryProfile}
          getColorFn={memColorMapper}
          viewAllHref$={getLinkToProfile('memory')}
        />
        <Hotspot
          title="Wait Time"
          profile={profiles.timeProfile}
          getColorFn={timeColorMapper}
          viewAllHref$={getLinkToProfile('time')}
        />
      </Row>
    </div>
  );
}

const headerColumnDefinitions = [
  {
    width: '6rem',
    getContent() {
      return <span className={locals.headerText}>Used</span>;
    }
  },
  {
    getContent() {
      return <span className={locals.headerText}>Code</span>;
    }
  }
];

const columnDefinitions = [
  {
    width: '6rem',
    getContent({ profile }) {
      return percentage.detailed(profile.selfTime);
    }
  },
  {
    getContent({ profile }) {
      return (
        <>
          <MethodName methodName={profile.methodName} />
          {profile.fileName && (
            <>
              <At />
              <FileNameAndLine canFetchSourceCode={false} profileNode={profile} />
            </>
          )}
        </>
      );
    }
  }
];

function Hotspot({ title, profile, viewAllHref$, getColorFn }) {
  if (!profile) {
    return null;
  }

  const profilesWithSelfTimes = getProfilesAsList(profile.profileGraph).filter(({ selfTime }) => selfTime > 0);
  const sortedProfilesWithSelfTimes = profilesWithSelfTimes.slice().sort((p1, p2) => p2.selfTime - p1.selfTime);
  const filteredProfiles = sortedProfilesWithSelfTimes.filter(({ selfTime }) => selfTime > selfTimeThreshold);
  // we want to show only self times > threshold but at least 5 items
  const enrichedProfilesWithSelfTimes = filteredProfiles.concat(
    sortedProfilesWithSelfTimes.slice(filteredProfiles.length, 5)
  );

  return (
    <Col xs={4}>
      <Card title={`${title} Hotspots`}>
        <div className={locals.content}>
          <div className={locals.hotspotLine}>{renderSelfTimeComponents(profilesWithSelfTimes, getColorFn)}</div>
          <Ul framed="topBottom">
            <Li>
              <ColumnizedContent columnDefinitions={headerColumnDefinitions} profile={profile} />
            </Li>
            {enrichedProfilesWithSelfTimes.map((profile, i) => (
              <Li key={i} renderNestedContent={() => <StackTrace profile={profile} />}>
                <ColumnizedContent columnDefinitions={columnDefinitions} profile={profile} />
              </Li>
            ))}
          </Ul>

          <ViewAllWrapper renderViewAll={ViewAll} viewAllHref$={viewAllHref$} className={locals.viewAllLink} />
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

function getProfilesAsList(profileGraph) {
  const allProfiles = [];
  profileGraph.forEach(p => add(p, allProfiles));
  return allProfiles;
}

function add(profile, list) {
  list.push(profile);
  if (profile.children) {
    for (let i = 0; i < profile.children.length; i++) {
      add(profile.children[i], list);
    }
  }
}

function ViewAll({ viewAllHref$ }, className) {
  return (
    <Link className={className} href$={viewAllHref$}>
      View all
    </Link>
  );
}
