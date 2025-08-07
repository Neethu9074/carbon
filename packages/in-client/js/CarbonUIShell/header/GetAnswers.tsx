/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import {
  assistmeEnabled,
  isControlledEnvEnabled,
  tealiumPrivacyEnabled,
  walkmeToolEnabled
} from 'in-services/featureFlags';
import {
  isAssistMeScriptLoaded,
  termsAndPrivacySettingsStore$
} from 'in-settings/terms/stores/termsAndPrivacySettingsStore';
import AssistMe from 'in-plg/components/AssistMe/AssistMe';

import local from 'in-client/js/CarbonUIShell/header/GetAnswers.mless';

export default function GetAnswers() {
  const termsAndPrivacySettingsStore = useObservable(termsAndPrivacySettingsStore$, []);
  const isWalkMeEnabled = tealiumPrivacyEnabled
    ? walkmeToolEnabled
    : termsAndPrivacySettingsStore?.walkmeAnalyticsServices;
  // The AssistMe feature will be enabled if The environment is not controlled, assistmeEnabled flag is true, walkme is loaded and the AssistMe script is loaded.
  const showGetAnswers = !isControlledEnvEnabled && isWalkMeEnabled && assistmeEnabled && isAssistMeScriptLoaded;

  if (showGetAnswers) {
    return (
      <>
        <div className={local.verticalLine} />
        <AssistMe />
      </>
    );
  }
  return null;
}
