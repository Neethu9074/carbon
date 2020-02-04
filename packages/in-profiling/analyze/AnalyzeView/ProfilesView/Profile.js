import React, { useState, useEffect } from 'react';

import ProfileFlameGraph from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileFlameGraph';
import { viewTypes } from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfilesView';
import ProfileChart from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileChart';
import ProfileTree from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileTree';
import ButtonSegmentedControl from 'in-new-components/ButtonSegmentedControl';
import SearchInput from 'in-new-components/SearchInput';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';

import locals from './Profile.mless';

export default function Profile({
  renderChart,
  viewType,
  setViewType,
  profile,
  isOnline,
  timeConfig,
  processId,
  jvmSnapshot,
  processSnapshot
}) {
  if (!profile) {
    return null;
  }

  let totalNumSamples = 0;
  for (let i = 0; i < profile.profileGraph.length; i++) {
    totalNumSamples += countSamples(profile.profileGraph[i]);
  }

  const [showGraph, setShowGraph] = useState(true);
  const [query, setQuery] = useState('');
  useEffect(() => setQuery(''), [viewType]);

  return (
    <>
      <div className={locals.header}>
        <div className={locals.leftSide}>
          <ButtonSegmentedControl
            buttonPropsList={[
              {
                text: 'Tree view',
                icon: 'lib_application_trace',
                key: viewTypes.tree,
                onClick: () => setViewType(viewTypes.tree)
              },
              {
                text: 'Flame graph',
                icon: 'lib_flame',
                key: viewTypes.flameGraph,
                onClick: () => setViewType(viewTypes.flameGraph)
              }
            ]}
            activeKey={viewType}
          />
          {renderChart && (
            <Button
              className={locals.graphButton}
              kind="secondary"
              icon="lib_views_stats"
              onClick={() => setShowGraph(!showGraph)}
            >
              {showGraph ? 'Hide ' : 'Show '} CPU graph
            </Button>
          )}
          {profile.rawProfileTimestamps && (
            <span className={locals.numProfilesLabel}>{profile.rawProfileTimestamps.length} Profiles</span>
          )}
          {totalNumSamples > 0 &&
            totalNumSamples < 100 && (
              <Tooltip
                content={`Statistical confidence in percentage distribution is low, because not enough samples where collected (${totalNumSamples} samples) in the selected Timeframe.`}
                align="rightMiddle"
              >
                <SvgIcon className={locals.icon} type="lib_approximately_equal" />
              </Tooltip>
            )}
        </div>
        {viewType === viewTypes.flameGraph && (
          <SearchInput onChange={setQuery} query={query} autoFocus maxWidth={200} />
        )}
      </div>

      {showGraph &&
        renderChart && (
          <ProfileChart profile={profile} timeConfig={timeConfig} processId={processId} jvmSnapshot={jvmSnapshot} />
        )}

      {viewType === viewTypes.tree ? (
        <ProfileTree profile={profile} processSnapshot={processSnapshot} isOnline={isOnline} />
      ) : (
        <ProfileFlameGraph profile={profile} query={query} />
      )}
    </>
  );
}

// export for test
export function countSamples(profile) {
  let totalSamples = profile.numSamples || 0;

  const children = profile.children || [];
  for (let i = 0; i < children.length; i++) {
    totalSamples += countSamples(children[i]);
  }

  return totalSamples;
}
