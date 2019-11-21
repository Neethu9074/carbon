import React from 'react';

import ProfileNode from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileNode';

import locals from './Profile.mless';

export default function Profile({ profile, isOnline, processSnapshot }) {
  if (!profile) {
    return null;
  }

  return (
    <>
      {profile.profileGraph.map((profileNode, i) => (
        <div key={i} className={locals.profile}>
          <ProfileNode profileNode={profileNode} processSnapshot={processSnapshot} isOnline={isOnline} />
        </div>
      ))}
    </>
  );
}
