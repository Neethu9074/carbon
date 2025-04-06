/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

import { CarbonButton, CarbonPopover, CarbonPopoverContent, Typography, CarbonStack } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-plg/components/ShowPrivacyNotification/ShowPrivacyNotification.mless';

export const ShowPrivacyNotification = () => {
  const localStorageKey = 'showPrivacyNotification';
  const [showNotification, setShowNotification] = useState(false);
  const [isOpen, setOpen] = useState(true);
  useEffect(() => {
    if (localStorage.getItem(localStorageKey) !== 'shown') {
      setShowNotification(true);
    }
  }, []);

  const handleButtonClick = () => {
    localStorage.setItem(localStorageKey, 'shown');
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!showNotification) return null;

  return (
    <CarbonPopover className={locals.notification} align="bottom-end" open={isOpen} caret>
      <CarbonPopoverContent className={locals.content}>
        <CarbonStack gap={4}>
          <CarbonStack gap={1}>
            <Typography onDark variant="body-bold">
              {t('in-plg:privacyNotification.title')}
            </Typography>
            <Typography onDark variant="body-regular">
              {t('in-plg:privacyNotification.description')}
            </Typography>
          </CarbonStack>
          <CarbonButton size="sm" onClick={handleButtonClick} className={locals.toggleTipButton}>
            {t('in-plg:privacyNotification.buttonText')}
          </CarbonButton>
        </CarbonStack>
      </CarbonPopoverContent>
    </CarbonPopover>
  );
};
