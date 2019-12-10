import React, { useState, useEffect } from 'react';

import ProfileFlameGraph from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileFlameGraph';
import { viewTypes } from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfilesView';
import ProfileTree from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileTree';
import ButtonSegmentedControl from 'in-new-components/ButtonSegmentedControl';
import ResultHeader from 'in-analyze/components/ResultHeader';
import SearchInput from 'in-new-components/SearchInput';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';

import locals from './Profile.mless';

export default function Profile({ viewType, setViewType, profile, isOnline, processSnapshot }) {
  let totalNumSamples = 0;
  for (let i = 0; i < profile.profileGraph.length; i++) {
    totalNumSamples += countSamples(profile.profileGraph[i]);
  }

  const [query, setQuery] = useState('');
  useEffect(() => setQuery(''), [viewType]);

  return (
    <Sticky
      header={
        <div className={locals.header}>
          <div className={locals.flexWrapper}>
            <ButtonSegmentedControl
              buttonPropsList={[
                {
                  text: 'Flame graph',
                  icon: 'lib_flame',
                  key: viewTypes.flameGraph,
                  onClick: () => setViewType(viewTypes.flameGraph)
                },
                {
                  text: 'Tree',
                  icon: 'lib_application_trace',
                  key: viewTypes.table,
                  onClick: () => setViewType(viewTypes.table)
                }
              ]}
              activeKey={viewType}
            />
            {viewType === viewTypes.flameGraph && (
              <SearchInput onChange={setQuery} query={query} autoFocus maxWidth={200} />
            )}
          </div>
          <div className={locals.flexWrapper}>
            <ResultHeader
              withoutMargin
              itemType="Profile"
              nbRows={profile.profileGraph.length}
              nbItems={profile.profileGraph.length}
            />
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
        </div>
      }
    >
      <div className={locals.content}>
        {viewType === 'table' ? (
          <ProfileTree profile={profile} processSnapshot={processSnapshot} isOnline={isOnline} />
        ) : (
          <ProfileFlameGraph profile={profile} query={query} />
        )}
      </div>
    </Sticky>
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
