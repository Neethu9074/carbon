import React, { useState, useEffect } from 'react';
import { create } from 'reactive-observables';

import CanvasBasedProfileFlameGraph from 'in-profiling/analyze/AnalyzeView/ProfilesView/CanvasBasedProfileFlameGraph';
import connectTo from 'in-hoc/connectTo';

import locals from './ProfileFlameGraph.mless';

export default function ProfileFlameGraphWrapper({ profile, query, setHighlightedProfileConfig, width = 0 }) {
  const [query$] = useState(create());
  useEffect(
    () => {
      query$.emit(query);
    },
    [query]
  );

  return (
    <ProfileFlameGraph
      query$={query$}
      width={width}
      profile={profile}
      setHighlightedProfileConfig={setHighlightedProfileConfig}
    />
  );
}

const ProfileFlameGraph = connectTo(
  ({ query$ }) => ({ query: query$.debounce(100) }),
  props => (
    <div className={locals.wrapper}>
      <CanvasBasedProfileFlameGraph {...props} />
    </div>
  )
);
