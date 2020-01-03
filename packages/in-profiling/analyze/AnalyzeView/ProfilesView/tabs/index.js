import React from 'react';

import { analyzeProfilePathFullyQualified } from 'in-profiling/navigation/paths';
import Profile from 'in-profiling/analyze/AnalyzeView/ProfilesView/Profile';

export default [
  {
    label: 'CPU',
    path: `${analyzeProfilePathFullyQualified}/cpu`,
    component: CpuProfile
  },
  {
    label: 'Memory',
    path: `${analyzeProfilePathFullyQualified}/memory`,
    component: MemoryProfile,
    isDisabled: result => !result.data || !result.data.memoryProfile
  },
  {
    label: 'Wait time',
    path: `${analyzeProfilePathFullyQualified}/time`,
    component: TimeProfile
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
