/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useState, useEffect } from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error missing a type definition for it
import { getAccountAsResultObservable } from 'in-amp/api/account';
import { AccountInfo } from 'in-plg/pages/WelcomePage/widgets/types/AccountInfoTypeDefinition';

export default function useGetAccountActivation() {
  const [activation, setActivation] = useState<{}>();
  const accountInfo: AccountInfo | null | undefined = useObservable(getAccountAsResultObservable, []);

  useEffect(() => {
    const activationData = accountInfo?.data?.activation;
    setActivation(activationData);
  }, [accountInfo]);

  return activation;
}
