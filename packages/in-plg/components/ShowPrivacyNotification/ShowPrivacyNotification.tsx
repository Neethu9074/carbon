/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

import {
  CarbonToggletip,
  CarbonToggletipActions,
  CarbonToggletipContent,
  CarbonButton,
  CarbonTheme
} from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-plg/components/ShowPrivacyNotification/ShowPrivacyNotification.mless';

export const ShowPrivacyNotification = () => {
  const localStorageKey = 'showPrivacyNotification';
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(localStorageKey) !== 'shown') {
      setShowNotification(true);
    }
  }, []);

  const handleButtonClick = () => {
    localStorage.setItem(localStorageKey, 'shown');
    setTimeout(() => {
      document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }, 0);
  };

  if (!showNotification) return null;

  return (
    <div className={locals.notification}>
      <CarbonTheme theme="g10">
        <CarbonToggletip data-carbon-theme="g10" align="bottom-right" defaultOpen className={locals.toggletip}>
          <CarbonToggletipContent className={locals.toggleTipContent}>
            <div className={locals.title}>{t('in-plg:privacyNotification.title')}</div>
            <div className={locals.description}>{t('in-plg:privacyNotification.description')}</div>
            <CarbonToggletipActions>
              <CarbonButton size="lg" onClick={handleButtonClick} className={locals.toggleTipButton}>
                {t('in-plg:privacyNotification.buttonText')}
              </CarbonButton>
            </CarbonToggletipActions>
          </CarbonToggletipContent>
        </CarbonToggletip>
      </CarbonTheme>
    </div>
  );
};
