import React from 'react';

import Tooltip from 'in-components/Tooltip';

export default function WithRestrictedTooltip({ isRestricted, children }) {
  if (!isRestricted) {
    return children;
  }

  return (
    <Tooltip themeStyle="light" content="This will be available once your instance is ready" align="bottomMiddle">
      {children}
    </Tooltip>
  );
}
