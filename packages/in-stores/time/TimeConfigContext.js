import React from 'react';

import { getTimeConfig, fixateTimeConfig } from 'in-stores/time/config';
import history from 'in-stores/navigation/history';

export const TimeConfigContext = React.createContext(getTimeConfigContext(history.location));

export function GlobalTimeConfig({ children, location }) {
  return <TimeConfigContext.Provider value={getTimeConfig(location)}>{children}</TimeConfigContext.Provider>;
}

function getTimeConfigContext(location) {
  const timeConfig = getTimeConfig(location);
  return {
    default: timeConfig,
    fixed: fixateTimeConfig(timeConfig)
  };
}
