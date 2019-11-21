import React from 'react';

import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import { analyzeProfilePathFullyQualified } from 'in-profiling/navigation/paths';
import Profile from 'in-profiling/analyze/AnalyzeView/ProfilesView/Profile';

export default [
  {
    label: 'CPU',
    path: `${analyzeProfilePathFullyQualified}/cpu`,
    component: CpuProfile,
    isFullWidth: true
  },
  {
    label: 'Memory',
    path: `${analyzeProfilePathFullyQualified}/memory`,
    component: MemoryProfile,
    isTabDisabled: result => !result.data || !result.data.memoryProfile,
    isFullWidth: true
  },
  {
    label: 'Wait time',
    path: `${analyzeProfilePathFullyQualified}/time`,
    component: TimeProfile,
    isFullWidth: true
  }
];

function CpuProfile({ data, processSnapshot, isOnline }) {
  return (
    <ContentWrapper>
      <Profile profile={data.cpuProfile} processSnapshot={processSnapshot} isOnline={isOnline} />
    </ContentWrapper>
  );
}

function MemoryProfile({ data, processSnapshot, isOnline }) {
  return (
    <ContentWrapper>
      <Profile profile={data.memoryProfile} processSnapshot={processSnapshot} isOnline={isOnline} />
    </ContentWrapper>
  );
}

function TimeProfile({ data, processSnapshot, isOnline }) {
  return (
    <ContentWrapper>
      <Profile profile={data.timeProfile} processSnapshot={processSnapshot} isOnline={isOnline} />
    </ContentWrapper>
  );
}
