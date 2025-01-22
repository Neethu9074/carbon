/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { CarbonButton } from '@instana/components';

import AssistMeSearchKeyword from 'in-plg/components/AssistMe/AssistMeDynamicSearch';
import { IconForButton } from '../IconForButton/IconForButton';
import { activeLanguage, t } from 'in-i18n';

export default function AssistMe() {
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    const handleEscKey = (event: any) => {
      if (event.key === 'Escape' && isExpanded) {
        //@ts-expect-error defined in AssistMe controller.js
        assistMeController.close();
        setIsExpanded(false);
      }
    };
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isExpanded]);
  return (
    <div data-search-context={AssistMeSearchKeyword()}>
      <CarbonButton
        id="wm-getanswers"
        kind="ghost"
        onClick={() => {
          openAssistMe();
          setIsExpanded(!isExpanded);
        }}
        aria-controls="ibm-assist-me-shell"
        aria-expanded={isExpanded}
        renderIcon={() => <IconForButton icon="lib_help_error_help_outline" iconSize="s" />}
      >
        {t('in-plg:licenseBanner.getAnswers')}
      </CarbonButton>
    </div>
  );
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

function changeWalkMeLanguage() {
  if (activeLanguage == 'en-US') {
    //@ts-expect-error WalkMeAPI is loaded during runtime using script
    WalkMeAPI.changeLanguage('en');
  } else {
    //@ts-expect-error WalkMeAPI is loaded during runtime using script
    WalkMeAPI.changeLanguage(activeLanguage);
  }
}

export function openAssistMe() {
  if (!assistMeController) {
    init();
  }
  changeWalkMeLanguage();
  //@ts-expect-error defined in AssistMe controller.js
  return assistMeController.isOpen() ? assistMeController.close() : assistMeController.open();
}
