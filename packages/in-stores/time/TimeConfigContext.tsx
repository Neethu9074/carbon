/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { getTimeConfig } from 'in-stores/time/config';

export const TimeConfigContext = React.createContext(
  getTimeConfig({
    pathname: '',
    query: {},
    matrix: {}
  })
);

export interface Props {
  children: ReactNode;
}

export function GlobalTimeConfig({ children }: Props) {
  const location = useLocation();
  const timeConfig = useStableObjectInstance(getTimeConfig(location));
  return <TimeConfigContext.Provider value={timeConfig}>{children}</TimeConfigContext.Provider>;
}
