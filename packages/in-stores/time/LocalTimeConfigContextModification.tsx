/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import { generateStableHash } from '@instana/utils';
import { TimeConfig } from '@instana/types';

import { TimeConfigContext } from 'in-stores/time/TimeConfigContext';
import { emptyArray } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export interface LocalTimeConfigContextModificationProps {
  modification: (timeConfig: TimeConfig) => TimeConfig;
  valuesToWatch?: any[];
}

export default function LocalTimeConfigContextModification({
  children,
  modification,
  valuesToWatch
}: React.PropsWithChildren<LocalTimeConfigContextModificationProps>) {
  const globalTimeConfig = useTimeConfig();

  const timeConfig = useMemo(
    () => modification(globalTimeConfig),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generateStableHash(globalTimeConfig), modification, ...(valuesToWatch || emptyArray)]
  );

  return <TimeConfigContext.Provider value={timeConfig}>{children}</TimeConfigContext.Provider>;
}
