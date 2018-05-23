import React from 'react';

import Badge from 'in-new-components/Badge';
import theme from 'in-themes';

export default function ErrorIndicator({ className, errorCount }) {
  // also on 0
  if (!errorCount) {
    return null;
  }

  return (
    <Badge className={className} color={theme.lib.colors.failure}>
      {errorCount}
    </Badge>
  );
}
