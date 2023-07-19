/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';

import { generateStableHash } from '@instana/utils';
import { TimeConfig } from '@instana/types';

import { TimeConfigContext } from 'in-stores/time/TimeConfigContext';
import { emptyArray } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export interface LocalTimeConfigContextModificationProps {
  children: React.PropsWithChildren<LocalTimeConfigContextModificationProps>;
  modification: (timeConfig: TimeConfig) => TimeConfig;
  valuesToWatch?: any[];
}
export default function LocalTimeConfigContextModification({
  children,
  modification,
  valuesToWatch
}: LocalTimeConfigContextModificationProps) {
  const globalTimeConfig = useTimeConfig();
  const [state, setState] = useState(() => modification(globalTimeConfig));

  useEffect(() => {
    const change = modification(globalTimeConfig);
    setState((current: TimeConfig) => {
      if (isEqual(current, change)) {
        return current;
      }
      return change;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash(globalTimeConfig), modification, ...(valuesToWatch || emptyArray)]);

  return <TimeConfigContext.Provider value={state}>{children}</TimeConfigContext.Provider>;
}
