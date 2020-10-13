import { useState, useEffect, useContext } from 'react';

import { TimeConfigContext } from 'in-stores/time/TimeConfigContext';

// Just a small alias to make usage of time configs in React components
// a lot more explicit.
export default function useTimeConfig() {
  const timeConfig = useContext(TimeConfigContext);
  const [memoizedTimeConfig, setMemoizedTimeConfig] = useState(timeConfig);
  useEffect(() => setMemoizedTimeConfig(timeConfig), [
    timeConfig.to,
    timeConfig.focusedMoment,
    timeConfig.windowSize,
    timeConfig.autoRefresh
  ]);
  return memoizedTimeConfig;
}
