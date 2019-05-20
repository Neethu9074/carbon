import React from 'react';

import Badge from 'in-new-components/Badge';
import theme from 'in-themes';

export default function ErrorIndicator({ className, errorCount, allowZero }) {
  // also on 0
  if (!errorCount && !allowZero) {
    return null;
  }

  return (
    <Badge className={className} color={errorCount > 0 ? theme.lib.colors.failure : theme.lib.colors.N400}>
      {errorCount}
    </Badge>
  );
}
