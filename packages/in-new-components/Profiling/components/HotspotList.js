/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import FileNameAndLine from 'in-new-components/Profiling/components/FileNameAndLine';
import MethodName from 'in-new-components/Profiling/components/MethodName';
import { Ul, Li, ColumnizedContent } from 'in-new-components/lists/List';
import { percentage } from 'in-services/formatters/number';
import At from 'in-new-components/Profiling/components/At';

import locals from './HotspotList.mless';

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

export default function HotspotList({
  size,
  profile,
  hotspots,
  getHref$,
  renderNestedContent,
  hotspotAutoExpandRowConfig
}) {
  return (
    <Ul framed="topBottom">
      <Li>
        <ColumnizedContent columnDefinitions={headerColumnDefinitions} profile={profile} />
      </Li>
      {hotspots.map((profile, i) => (
        <Li
          key={i}
          size={size}
          href$={getHref$ ? getHref$(profile) : undefined}
          initiallyOpen={shouldAutoOpen(profile, hotspotAutoExpandRowConfig)}
          renderNestedContent={renderNestedContent ? () => renderNestedContent(profile) : undefined}
        >
          <ColumnizedContent columnDefinitions={columnDefinitions} profile={profile} />
        </Li>
      ))}
    </Ul>
  );
}

function shouldAutoOpen(profile, hotspotAutoExpandRowConfig) {
  if (!hotspotAutoExpandRowConfig) {
    return false;
  }
  return (
    profile.methodName === hotspotAutoExpandRowConfig.methodName &&
    profile.fileName === hotspotAutoExpandRowConfig.fileName &&
    profile.fileLine === hotspotAutoExpandRowConfig.fileLine
  );
}
