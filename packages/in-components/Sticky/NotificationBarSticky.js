/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';

import { OpenTrialExpiryDialog } from 'in-plg/components/Dialog/TrialExpiryDialog';
import { StickyBanner } from 'in-plg/components/LicenseBanner/StickyBanner';
import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { days } from 'in-services/time';

export default function NotificationBarSticky() {
  const [expired, setExpired] = useState(false);

  const messages = useObservable(messages$, []);
  if (!messages || messages.length === 0) {
    return null;
  }
  const firstLicenseUsageMsg = messages.find(message => message.isLicenseUsageMsg);
  //Logic part of licenseExpiryPopUp
  if (!firstLicenseUsageMsg) {
    return null;
  }
  const sevenDaysInMilliseconds = days.toMillis(7);
  const isSevenDaysOver = Date.now() - firstLicenseUsageMsg.expiryDate > sevenDaysInMilliseconds;
  const isExpired = Date.now() - firstLicenseUsageMsg.expiryDate > 0;

  const dialog = <OpenTrialExpiryDialog message={firstLicenseUsageMsg} isSevenDaysOver={isSevenDaysOver} />;

  if (isExpired) {
    if (!expired) {
      addActiveDialog(dialog);
      setExpired(true);
    }
  }

  return (
    <>
      <StickyBanner key={firstLicenseUsageMsg.id} message={firstLicenseUsageMsg} />
    </>
  );
}
