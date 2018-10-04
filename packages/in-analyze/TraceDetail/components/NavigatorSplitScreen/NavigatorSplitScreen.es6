import React from 'react';

import ItemsInGroupsIndicator from 'in-analyze/components/ItemsInGroupsIndicator';

import locals from './NavigatorSplitScreen.mless';

export default function NavigatorSplitScreen({ navigator, traceDetail }) {
  const { isTracesDataSource, totalHits } = navigator.props;

  const numTraces = isTracesDataSource ? totalHits : undefined;
  const numCalls = isTracesDataSource ? undefined : totalHits;

  return (
    <div className={locals.navigatorSplitScreen}>
      <div className={locals.navigator}>
        <div className={locals.header}>
          <ItemsInGroupsIndicator numTraces={numTraces} numCalls={numCalls} />
        </div>

        {navigator}
      </div>
      <div className={locals.traceDetail}>{traceDetail}</div>
    </div>
  );
}
