import React from 'react';

import { analyzeProfilePathFullyQualified } from 'in-profiling/navigation/paths';
import Profile from 'in-profiling/analyze/AnalyzeView/ProfilesView/Profile';

export default [
  {
    label: 'CPU',
    path: `${analyzeProfilePathFullyQualified}/cpu`,
    component: CpuProfile,
    isVisible: result => result.data && result.data.cpuProfile
  },
  {
    label: 'Memory',
    path: `${analyzeProfilePathFullyQualified}/memory`,
    component: MemoryProfile,
    isVisible: result => result.data && result.data.memoryProfile
  },
  {
    label: 'Wait time',
    path: `${analyzeProfilePathFullyQualified}/time`,
    component: TimeProfile
  }
];

function CpuProfile(props) {
  return <Profile isCpuProfile profile={props.data.cpuProfile} renderChart {...props} />;
}

function MemoryProfile(props) {
  return <Profile isMemoryProfile profile={props.data.memoryProfile} {...props} />;
}

function TimeProfile(props) {
  return <Profile isWaitTimeProfile profile={props.data.timeProfile} {...props} />;
}
