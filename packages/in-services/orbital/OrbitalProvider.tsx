/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import orbital, { OrbitalSdk } from '@useorbital/client-sdk';

import { orbitalEnabled } from 'in-services/featureFlags';
import { user } from 'in-stores/user';

const OrbitalContext = createContext<OrbitalSdk | undefined>(undefined);

export default function OrbitalProvider({ children, spaceId }: PropsWithChildren<{ spaceId: string }>) {
  const [sdk, setSdk] = useState<OrbitalSdk | undefined>(undefined);

  useEffect(() => {
    if (orbitalEnabled && spaceId)
      orbital(spaceId)
        .then(setSdk)
        .catch(e => e);
  }, [spaceId]);
  useEffect(() => {
    if (sdk) {
      //@ts-expect-error
      sdk.identify(user?.id);
    }
  }, [sdk]);
  return <OrbitalContext.Provider value={sdk}>{children}</OrbitalContext.Provider>;
}

export function useOrbital(): OrbitalSdk | undefined {
  return useContext(OrbitalContext);
}
