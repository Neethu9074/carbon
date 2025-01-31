/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { CarbonButton, Typography } from '@instana/components';

import { Message } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { BuyNowDialog } from '../BuyNowDialog/BuyNowDialog';
import BaseDialog from 'in-components/Dialog/BaseDialog';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

interface OpenTrailExpiryDialogProps {
  message: Message;
  isSevenDaysOver: boolean;
}

export function OpenTrialExpiryDialog({ message, isSevenDaysOver }: OpenTrailExpiryDialogProps) {
  return (
    message.latestExpiredLicenseType == 'selfService' && (
      <BaseDialog
        onSubmit={noop}
        title={
          !isSevenDaysOver
            ? t('in-plg:trialExpirationPopUp.titleBeforeTrialPeriodEnd')
            : t('in-plg:trialExpirationPopUp.titleAfterTrialPeriodEnd')
        }
        customButtons={
          <CarbonButton
            kind="primary"
            onClick={() => {
              addActiveDialog(<BuyNowDialog />);
            }}
          >
            {t('in-plg:licenseBanner.buyNow')}
          </CarbonButton>
        }
      >
        <Typography variant="body-regular">
          {!isSevenDaysOver
            ? t('in-plg:trialExpirationPopUp.trialExpirationPopUpDescription')
            : t('in-plg:trialExpirationPopUp.trialExpirationPopUpDescriptionAfterSevenDays')}
        </Typography>
      </BaseDialog>
    )
  );
}
