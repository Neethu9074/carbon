/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import {
  CarbonModal,
  CarbonRadioButton,
  CarbonRadioButtonGroup,
  CarbonTextArea,
  Typography
} from '@instana/components';

import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './FeedbackModal.mless';

interface FeedbackModalProps {
  handleSubmitTracking: (feedbackObj: Object) => void;
  feedbackState: 'up' | 'down' | null;
  // Feedback subject string that will be used in the modal
  // feedback question (const feedbackQuestion)
  feedbackTextSubject: string;
  // IsOpen and setIsOpen are optional
  // This allows for this Feedback Modal to be used inside "addActiveDialog"
  // Or stand alone carbon modal (when is open and set is open are used).
  isOpen?: boolean;
  setIsOpen?: Function;
}

//If needed in other places, can be modified to be reusable. Currently specific to summary feedback.
export default function FeedbackModal({
  handleSubmitTracking,
  feedbackState,
  isOpen,
  setIsOpen,
  feedbackTextSubject
}: FeedbackModalProps) {
  const [feedbackText, setFeedbackText] = useState('');
  const [contactUserSelection, setContactUserSelection] = useState('contact-yes');
  const feedbackQuestion =
    feedbackState === 'up'
      ? t('in-events:feedbackModal.helpfulQ', { textSubject: feedbackTextSubject })
      : t('in-events:feedbackModal.improveQ', { textSubject: feedbackTextSubject });

  const openDetermined = () => {
    if (isOpen !== undefined) {
      // no addActiveDialog used
      return isOpen;
    } else {
      // addActiveDialog used
      return true;
    }
  };
  const handleClose = () => {
    if (isOpen !== undefined && setIsOpen) {
      // no addActiveDialog used
      setIsOpen(false);
    } else {
      // addActiveDialog used
      close();
    }
  };

  return (
    <CarbonModal
      open={openDetermined()}
      isFullWidth
      onRequestClose={() => handleClose()}
      secondaryButtonText={t('in-events:feedbackModal.cancel')}
      primaryButtonText={t('in-events:feedbackModal.submit')}
      modalHeading={t('in-events:feedbackModal.title')}
      onRequestSubmit={() => {
        const trackingObj = { feedback: feedbackText, contactUserSelection: contactUserSelection };
        handleSubmitTracking(trackingObj);
        handleClose();
      }}
      primaryButtonDisabled={feedbackText === ''}
      size="sm"
    >
      <div className={locals.contentWrapper}>
        <div className={locals.innerContent}>
          <div className={locals.experienceSection}>
            <Typography variant={'heading-03'}> {feedbackQuestion} </Typography>
            <CarbonTextArea
              labelText={''}
              placeholder={t('in-events:feedbackModal.maxChars')}
              value={feedbackText as string}
              onChange={e => {
                setFeedbackText(e.target.value);
              }}
              enableCounter
              maxCount={750}
            />
          </div>
          <div className={locals.followUpSection}>
            <CarbonRadioButtonGroup
              legendText={t('in-events:feedbackModal.followUpQuestion')}
              name="follow-up-confirm"
              defaultSelected={contactUserSelection}
              orientation="vertical"
              onChange={value => {
                setContactUserSelection(value as string);
              }}
            >
              <CarbonRadioButton
                labelText={t('in-events:feedbackModal.yesContect')}
                value="contact-yes"
                id="contact-yes"
              />
              <CarbonRadioButton
                labelText={t('in-events:feedbackModal.noContact')}
                value="contact-no"
                id="contact-no"
              />
            </CarbonRadioButtonGroup>
          </div>
        </div>
      </div>
    </CarbonModal>
  );
}
