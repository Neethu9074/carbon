import React from 'react';

import locals from './NavigatorSplitScreen.mless';

export default function NavigatorSplitScreen({ navigator, traceDetail }) {
  return (
    <div className={locals.navigatorSplitScreen}>
      <div className={locals.navigator}>{navigator}</div>
      <div className={locals.traceDetail}>{traceDetail}</div>
    </div>
  );
}
