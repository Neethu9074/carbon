/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { useLinkToCrash } from 'in-mobile-apps/navigation/paths';
import { t } from 'in-i18n';

import locals from './ViewCrashGroupButton.mless';

const ViewCrashGroupButton = ({ mobileAppId, errorMessage }) => {
  const getLinkToMobileAppCrash = useLinkToCrash();
  try {
    errorMessage = String(JSON.parse(errorMessage));
  } catch (e) {
    // ignore
  }
  return (
    <Button
      className={locals.button}
      kind="primaryv2"
      href={getLinkToMobileAppCrash(mobileAppId, { crashId: errorMessage })}
      size="compact"
    >
      {t('in-mobile-apps:sessionView.tabsSumCrashGroupButton.viewCrashGrpBtn')}
    </Button>
  );
};

export default ViewCrashGroupButton;
