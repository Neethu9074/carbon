import { get } from 'lodash';
import React from 'react';

import locals from './PodResourceTooltipContent.mless';

export default function PodStatusTooltipContent({ pod }) {
  return (
    <div className={locals.tooltip}>
      <div className={locals.podPhaseLabel}>{`Pod Phase:  ${get(pod, ['status', 'phase'], pod.phase)}`}</div>

      <div className={locals.headlingFlexWrapper}>
        <span>Container</span>
        <span>Status</span>
        <span>Ready</span>
      </div>
    </div>
  );
}
