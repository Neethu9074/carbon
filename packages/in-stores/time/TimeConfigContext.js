import React from 'react';

import { getTimeConfig } from 'in-stores/time/config';
import history from 'in-stores/navigation/history';

export const TimeConfigContext = React.createContext(getTimeConfig(history.location));

export function GlobalTimeConfig({ children, location }) {
  return <TimeConfigContext.Provider value={getTimeConfig(location)}>{children}</TimeConfigContext.Provider>;
}

