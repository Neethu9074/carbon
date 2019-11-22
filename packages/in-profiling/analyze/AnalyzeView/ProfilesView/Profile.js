import React from 'react';

import ProfileNode from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileNode';
import ResultHeader from 'in-analyze/components/ResultHeader';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './Profile.mless';

export default function Profile({ profile, isOnline, processSnapshot }) {
  if (!profile) {
    return null;
  }

  let totalNumSamples = 0;
  for (let i = 0; i < profile.profileGraph.length; i++) {
    totalNumSamples += countSamples(profile.profileGraph[i]);
  }

  return (
    <>
      <div className={locals.header}>
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
      {profile.profileGraph.map((profileNode, i) => (
        <div key={i} className={locals.profile}>
          <ProfileNode profileNode={profileNode} processSnapshot={processSnapshot} isOnline={isOnline} />
        </div>
      ))}
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
