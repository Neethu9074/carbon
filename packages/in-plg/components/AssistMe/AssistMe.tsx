/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { LicenseBannerButton } from '@instana/components';

import { isCarbonShellEnabled } from 'in-components/MainNavigation/components/isCarbonShellEnabled';
import IconButton from 'in-components/IconButton/IconButton';
import { t } from 'in-i18n';

export default function AssistMe({ isAssistMeEnabled }: { isAssistMeEnabled: boolean }) {
  if (isAssistMeEnabled) {
    if (isCarbonShellEnabled()) {
      return (
        <div data-search-context={t('in-plg:assistme.dataSearchContext.gettingStarted')}>
          <LicenseBannerButton
            id="wm-getanswers"
            kind="ghost"
            icon="lib_help_error_help_outline"
            iconColor="currentColor"
            onClick={openAssistMe}
          >
            {t('in-plg:licenseBanner.getAnswers')}
          </LicenseBannerButton>
        </div>
      );
    }
    return (
      <div data-search-context={t('in-plg:assistme.dataSearchContext.gettingStarted')}>
        <IconButton buttonType="button" kind="secondary" type="lib_help_error_help_outline" onClick={openAssistMe} />
      </div>
    );
  } else {
    return null;
  }
}
interface AssistMeKeys {
  productId: string;
  topSpacing: string;
  zIndex: number;
}
const assistMeProperties = {
  productId: 'a875055db9b7697d9da869d8f5db0f7c',
  topSpacing: '46px',
  zIndex: 4500
};
var assistMeController: AssistMeKeys;
function init() {
  // @ts-expect-error defined in AssistMe controller.js
  assistMeController = window.initAssistMeController(assistMeProperties);
}
export function openAssistMe() {
  if (!assistMeController) {
    init();
  }
  //@ts-expect-error defined in AssistMe controller.js
  return assistMeController.isOpen() ? assistMeController.close() : assistMeController.open();
}
