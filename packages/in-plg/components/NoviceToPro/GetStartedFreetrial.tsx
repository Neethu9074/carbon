/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ArrowRight, Launch } from '@carbon/icons-react';
import React, { useEffect } from 'react';

import { Button, ProgressIndicator, ProgressStep, Stack } from '@instana/carbon';
import { Tearsheet } from '@instana/ibm-products';
import { Typography } from '@instana/components';

import { triggerFreeTrialSelectionSegmentEvent, triggerPageLoadFreeTrial } from 'in-plg/components/NoviceToPro/segment';
import { UserSettings, userSettings as userSettingsGlobal } from 'in-services/userSettings/globals';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import GetStarted from 'in-plg/components/NoviceToPro/assets/GetStarted.png';
import { saveUserSettings } from 'in-services/userSettings';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-plg/components/NoviceToPro/GetStartedFreetrial.mless';

interface GetStartedFreetrialProps {
  handleButtonClick: () => void;
}

export default function GetStartedFreetrial({ handleButtonClick }: GetStartedFreetrialProps) {
  const username = user?.fullName;
  const userEmail = user?.email;
  const encodedUserEmail = encodeURIComponent(userEmail ?? '');
  const url = `https://www.ibm.com/account/reg/us-en/signup?formid=urx-52153&email=${encodedUserEmail}`;
  const headerTitle = t('in-plg:trialNoviceToProDialog.welcometitle', { username });
  const steps = [t('in-plg:trialNoviceToProDialog.steps.stepOne'), t('in-plg:trialNoviceToProDialog.steps.stepTwo')];
  const currentStep = 1;

  const clickFreeTrial = (): void => {
    const data = { type: 'freeTrial' };
    triggerFreeTrialSelectionSegmentEvent(data);
    handleButtonClick();
  };

  const clickPlayWith = (): void => {
    const data = { type: 'sandBox' };
    triggerFreeTrialSelectionSegmentEvent(data);
    const userSettings = Object.freeze({ ...userSettingsGlobal, showFreetrialSelection: true });
    saveUserSettings(userSettings, savedBackendSettings => {
      window.instana.termsAndPrivacySettings = savedBackendSettings as UserSettings;
    });
  };

  useEffect(() => {
    triggerPageLoadFreeTrial();
  }, []);

  return (
    //@ts-expect-error: Suppressing this error as the `children` prop is unsupported in the type definitions.
    <Tearsheet
      open
      className={locals.fullScreenModal}
      hasCloseIcon={false}
      selectorPrimaryFocus="#freetrial-header-title"
      title={
        <>
          <Typography variant="heading-04">{headerTitle} </Typography>

          <ProgressIndicator className={locals.progressIndicator} currentIndex={currentStep} spaceEqually>
            {steps.map((step, index) => (
              <ProgressStep
                key={`step-${step}`}
                current={currentStep === index}
                complete={index < currentStep}
                index={index}
                disabled={index > currentStep}
                label={step}
              />
            ))}
          </ProgressIndicator>
        </>
      }
    >
      <Stack gap={7} orientation="vertical">
        <div className={locals.textWrapper}>
          <div className={locals.text}>
            <LeftRightPadding>
              <Stack gap={10} orientation="vertical">
                <Stack className={locals.spacing} gap={6} orientation="vertical">
                  <Typography variant="heading-05">{t('in-plg:trialNoviceToProDialog.getStarted')}</Typography>
                  <Typography variant="body-regular">
                    {t('in-plg:trialNoviceToProDialog.descriptionFreeTrial')}
                  </Typography>
                  <Typography variant="body-regular">
                    {t('in-plg:trialNoviceToProDialog.descriptionSandbox')}
                  </Typography>
                </Stack>
                <Stack gap={6} orientation="vertical">
                  <Button kind="tertiary" renderIcon={ArrowRight} onClick={clickFreeTrial}>
                    {t('in-plg:trialNoviceToProDialog.trialButtonData')}
                  </Button>
                  <Button kind="ghost" renderIcon={Launch} href={url} onClick={clickPlayWith}>
                    {t('in-plg:trialNoviceToProDialog.sandboxButtonData')}
                  </Button>
                </Stack>
              </Stack>
            </LeftRightPadding>
          </div>
          <div className={locals.imageWrapper}>
            <img src={GetStarted} alt="Visual" className={locals.image} />
          </div>
        </div>
      </Stack>
    </Tearsheet>
  );
}
