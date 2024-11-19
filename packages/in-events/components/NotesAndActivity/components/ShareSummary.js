/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { CarbonModal, CarbonTextArea, CarbonTextInput, CarbonForm } from '@instana/components';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { EVENT_AI_SHARE_SUBMIT } from 'in-services/tracking/eventNames';
import { validRecipients, handleTracking } from './utils';
import { shareEventSummary } from 'in-stores/events';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ShareSummary.mless';

// We want to be able to share the summary with a user via email
// This component uses are Carbon Modal that allows for the user to input
// a list of emails they want to share the summary to, specify the subject
// and manual edit the summary if desired.
export function ShareSummary({ summary, open, setShareOpen, setNeedOverlay, incidentId, problemText }) {
  const [textSummary, setTextSummary] = useState(summary);
  // Tracks if manual input has been done on the sumarization
  const [manualInput, setManualInput] = useState(false);
  // Default the subject text with the problem text (name) of the incident
  const [subject, setSubject] = useState(
    t('in-events:notes.shareIncidentSummarySubject', { problemText: problemText })
  );
  const [recipients, setRecipients] = useState('');
  // To achieve some custom styling we need to know if the summary text is currently focused
  const [summaryTextFocused, setSummaryTextFocused] = useState('');
  const [validForm, setValidForm] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      <CarbonModal
        open={open}
        onRequestClose={() => {
          setTimeout(() => {
            setNeedOverlay(false);
          }, 500);
          setTextSummary(summary);
          setShareOpen(false);
          setManualInput(false);
          setValidForm(true);
        }}
        onRequestSubmit={() => {
          const recipientsResult = validRecipients(recipients);
          setValidForm(recipientsResult);
          setHasError(false);
          if (recipientsResult) {
            // If there is manual modifications to the summary we need to specify that in the body
            const summaryToShare =
              (manualInput && `${textSummary}\n\n${t('in-events:notes.withManualEdits')}`) || `${summary}`;
            // Here we know the recipients are valid -- remove white space and create the array needed for the api
            const recipientsList = recipients.replace(/\s/g, '').split(',');
            handleShareSummary(incidentId, recipientsList, summaryToShare, subject, setHasError, setShareOpen);
          }
        }}
        modalHeading={t('in-events:notes.shareSummary')}
        primaryButtonText={t('in-events:notes.share')}
        secondaryButtonText={t('in-events:notes.cancel')}
      >
        {t('in-events:notes.takeSomeTimeReview')}
        <CarbonForm className={locals.formWrapper}>
          <div className={locals.summarySubHeader}>{t('in-events:notes.summaryEmail')}</div>
          <CarbonTextInput
            id={'share-recipients'}
            labelText={t('in-events:notes.recipients')}
            type="text"
            invalidText={t('in-events:notes.invalidEmail')}
            invalid={!validForm}
            onChange={e => {
              setRecipients(e.target.value);
            }}
            className={classNames({
              [locals.labelInField]: true,
              [locals.separator]: true
            })}
          />
          <CarbonTextInput
            id={'share-subject'}
            labelText={t('in-events:notes.subject')}
            type="text"
            value={subject}
            onChange={e => {
              setSubject(e.target.value);
            }}
            className={classNames({
              [locals.labelInField]: true,
              [locals.separator]: true
            })}
          />
          <CarbonTextArea
            labelText={t('in-events:notes.body')}
            helperText={manualInput && t('in-events:notes.withManualEdits')}
            value={(!manualInput && summary) || textSummary}
            rows={7}
            onFocus={() => {
              setSummaryTextFocused(true);
            }}
            onBlur={() => {
              setSummaryTextFocused(false);
            }}
            onChange={e => {
              setManualInput(true);
              setTextSummary(e.target.value);
            }}
            className={classNames({
              [locals.labelInField]: true,
              [locals.separator]: true,
              [locals.noDefaultBorder]: true,
              [locals.focusBorder]: summaryTextFocused
            })}
          />
          {hasError && (
            <div className={locals.errorMessage}>
              <div>{t('in-events:notes.somethingWrong')}</div>
              {hasError}
            </div>
          )}
        </CarbonForm>
      </CarbonModal>
    </>
  );
}

// Handle the share summary submission and construct all proper params to send to api.
// On success - close modal and send notification
// On error - show error message
export function handleShareSummary(incidentId, recipients, body, subject, setHasError, setShareOpen) {
  const userName = user.preferredName;
  const milliseconds = Date.now();
  const incidentLink = window.location.href;
  shareEventSummary(incidentId, recipients, milliseconds, userName, subject, body, incidentLink).once(
    // On Success
    () => {
      setShareOpen(false);
      setHasError(false);
      addMessage(
        {
          type: 'info',
          timeout: 10000,
          title: t('in-events:notes.sharedSuccess'),
          content: t('in-events:notes.sumSent')
        },
        'shared-summarization-generated'
      );
      handleTracking(incidentId, EVENT_AI_SHARE_SUBMIT);
    },
    // On Error
    error => {
      setHasError(error?.message);
    }
  );
}
