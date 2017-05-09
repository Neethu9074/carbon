import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';

import './TraceViewTabs.less';

const block = 'in-trace-view-tabs';

export default function TraceViewTabs({ children }) {
  return (
    <FullscreenOverlayView className={block}>
      <ul className={`${block}__tabs`}>
        <li className={`${block}__tab`}>Traces (5)</li>
        <li className={`${block}__tab`}>Analytics (0)</li>
      </ul>

      {children}
    </FullscreenOverlayView>
  );
}
