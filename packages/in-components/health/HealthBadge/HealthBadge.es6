import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import { getColorBySeverity } from 'in-stores/events';

import locals from './HealthBadge.mless';

export default function HealthBadge({ openIssues = 0, maxSeverity = 0, className }) {
  const color = maxSeverity > 0 ? getColorBySeverity(maxSeverity) : '#92A5AE';

  return (
    <span
      className={joinClassNames(className, locals.badge)}
      style={{
        color: maxSeverity < 6 ? '#172429' : '#fff',
        backgroundColor: color
      }}
    >
      {openIssues}
    </span>
  );
}
