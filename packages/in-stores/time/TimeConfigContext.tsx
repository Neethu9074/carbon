/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { getTimeConfig } from 'in-stores/time/config';
import history from 'in-stores/navigation/history';

export const TimeConfigContext = React.createContext(getTimeConfig(history.location));

export function GlobalTimeConfig({ children, location }) {
  const timeConfig = useStableObjectInstance(getTimeConfig(location));
  return <TimeConfigContext.Provider value={timeConfig}>{children}</TimeConfigContext.Provider>;
}
