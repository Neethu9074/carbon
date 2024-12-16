/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect, useState } from 'react';

import { isAvailableCached } from 'in-settings/tabs/UserSettings/api/changePassword';
import { disableInvitesWithIdpEnabled } from 'in-services/featureFlags';

const useIsAnyIdPActive = (): boolean => {
  const [isAnyIdPActive, setIsAnyIdPActive] = useState(false);

  useEffect(() => {
    if (disableInvitesWithIdpEnabled) {
      isAvailableCached().once(data => {
        // If password authentication is available, IdP is not active, therefore result needs to be negated
        setIsAnyIdPActive(!data);
      });
    } else {
      setIsAnyIdPActive(false);
    }
  }, []);

  return isAnyIdPActive;
};

export default useIsAnyIdPActive;
