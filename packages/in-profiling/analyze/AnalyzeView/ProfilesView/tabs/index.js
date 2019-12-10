import React from 'react';

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

function CpuProfile(props) {
  return <Profile profile={props.data.cpuProfile} {...props} />;
}

function MemoryProfile(props) {
  return <Profile profile={props.data.memoryProfile} {...props} />;
}

function TimeProfile(props) {
  return <Profile profile={props.data.timeProfile} {...props} />;
}
