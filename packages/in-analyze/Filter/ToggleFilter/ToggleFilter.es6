import React from 'react';

import BasicFilter from 'in-analyze/Filter/BasicFilter';
import theme from 'in-themes/theme';

export default function ToggleFilter(props) {
  const { isEnabled, onClick } = props;
  return (
    <BasicFilter
      {...props}
      onClick={() => onClick(!isEnabled)}
      color={isEnabled ? theme.lib.colors.success : null}
      isDeactivated={!isEnabled}
    />
  );
}
