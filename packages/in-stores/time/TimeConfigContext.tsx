/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { getTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';
import history from 'in-stores/navigation/history';

export const TimeConfigContext = React.createContext(getTimeConfig(history.location));

export interface Props {
  location: Location;
  children: ReactNode;
}

export function GlobalTimeConfig({ children, location }: Props) {
  const timeConfig = useStableObjectInstance(getTimeConfig(location));
  return <TimeConfigContext.Provider value={timeConfig}>{children}</TimeConfigContext.Provider>;
}
