/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { create } from '@instana/observables';

import CanvasBasedProfileFlameGraph from 'in-profiling/analyze/AnalyzeView/ProfilesView/CanvasBasedProfileFlameGraph';
import connectTo from 'in-hoc/connectTo';

import locals from './ProfileFlameGraph.mless';

export default function ProfileFlameGraphWrapper(props) {
  const { query, width = 0 } = props;
  const [query$] = useState(create());
  useEffect(() => {
    query$.emit(query);
  }, [query, query$]);

  return <ProfileFlameGraph {...props} query$={query$} width={width} />;
}

const ProfileFlameGraph = connectTo(
  ({ query$ }) => ({ query: query$.debounce(100) }),
  props => (
    <div className={locals.wrapper}>
      <CanvasBasedProfileFlameGraph {...props} />
    </div>
  )
);
