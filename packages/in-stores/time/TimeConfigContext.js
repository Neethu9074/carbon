import React from 'react';

import useStableObjectIntance from 'in-hooks/useStableObjectIntance';
import { getTimeConfig } from 'in-stores/time/config';
import history from 'in-stores/navigation/history';

export const TimeConfigContext = React.createContext(getTimeConfig(history.location));

export function GlobalTimeConfig({ children, location }) {
  const timeConfig = useStableObjectIntance(getTimeConfig(location));
  return <TimeConfigContext.Provider value={timeConfig}>{children}</TimeConfigContext.Provider>;
}
